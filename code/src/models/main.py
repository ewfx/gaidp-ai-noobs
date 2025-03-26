import os
import sys
from dotenv import load_dotenv
from services.extract import extract_pdf_text
from services.vector_store import initialize_vector_store, load_vector_store, retrieve_documents
from services.llm_service import query_llm
from configuration.config import CONFIG

sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()

if __name__ == "__main__":
    extract_pdf_text(CONFIG["FILE_PATH"], CONFIG["PAGES_TO_LOAD"], CONFIG["OUTPUT_PATH"])

    if not os.path.exists(CONFIG["PERSISTENT_DIRECTORY"]):
        db = initialize_vector_store(CONFIG["OUTPUT_PATH"], CONFIG["PERSISTENT_DIRECTORY"], CONFIG["EMBEDDING_MODEL"])
    else:
        db = load_vector_store(CONFIG["PERSISTENT_DIRECTORY"], CONFIG["EMBEDDING_MODEL"])

    user_query = "Generate data profiling rules for Schedule H-1 to flag high-risk transactions based on regulatory standards. Provide 30 rules without explanation."
    relevant_docs = retrieve_documents(db, user_query)
    
    query_llm(CONFIG["LLM_MODEL"], user_query, relevant_docs)
