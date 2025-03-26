import os
import sys
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv()

file_path = "FR_Y-14Q20240331_i.pdf"
output_path = "documents/extracted_text.txt"
current_dir = os.path.dirname(os.path.abspath(__file__))
persistent_directory = os.path.join(current_dir, "db", "chroma_db")

if not os.path.exists(file_path):
    raise FileNotFoundError(f"The file {file_path} does not exist.")

pdf = PdfReader(file_path)
pages_to_load = list(range(4, 11)) + list(range(161, 255))

raw_text = ""
for page_num in pages_to_load:
    content = pdf.pages[page_num].extract_text()
    if content:
        raw_text += f"\n--- Page {page_num + 1} ---\n{content}"

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(raw_text)

embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

if not os.path.exists(persistent_directory):
    loader = TextLoader(output_path, encoding='utf-8')
    documents = loader.load()
    text_splitter = CharacterTextSplitter(separator=" ", chunk_size=3000, chunk_overlap=100)
    docs = text_splitter.split_documents(documents)
    db = Chroma.from_documents(docs, embeddings, persist_directory=persistent_directory)
else:
    db = Chroma(persist_directory=persistent_directory, embedding_function=embeddings)

query = "Generate data profiling rules for Schedule H-1 to flag high-risk transactions based on regulatory standards. Provide at least 30 rules without explanation."
retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 3})
relevant_docs = retriever.invoke(query)

combined_input = "Here are some documents that might help answer the question: " + query + "\n\nRelevant Documents:\n" + "\n\n".join([doc.page_content for doc in relevant_docs])

llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")
messages = [
    SystemMessage(content="You are a financial risk expert working in a bank."),
    HumanMessage(content=combined_input),
]

result = llm.invoke(messages)
print(result.content)
