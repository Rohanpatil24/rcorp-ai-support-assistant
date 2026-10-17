import math
import re
from collections import Counter
from .models import KnowledgeDocument

def tokenize(text):
    """Simple alphanumeric tokenizer with stopword filtration."""
    stop_words = {
        'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'of', 'for', 
        'to', 'with', 'as', 'by', 'that', 'this', 'it', 'from', 'be', 'are', 'was'
    }
    words = re.findall(r'\b[a-zA-Z0-9_]{2,}\b', text.lower())
    return [w for w in words if w not in stop_words]

def compute_tf(tokens):
    tf = Counter(tokens)
    total = len(tokens) or 1
    return {k: v / total for k, v in tf.items()}

def cosine_similarity_dict(tf1, tf2):
    common_words = set(tf1.keys()) & set(tf2.keys())
    if not common_words:
        return 0.0
    dot_product = sum(tf1[w] * tf2[w] for w in common_words)
    mag1 = math.sqrt(sum(v ** 2 for v in tf1.values()))
    mag2 = math.sqrt(sum(v ** 2 for v in tf2.values()))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot_product / (mag1 * mag2)

class VectorStoreRetriever:
    """
    RAG semantic search retriever across active KnowledgeBase documents.
    Provides semantic matching, relevance scoring, and citation generation.
    """
    @classmethod
    def search(cls, query, top_k=3):
        active_docs = KnowledgeDocument.objects.filter(is_active=True)
        if not active_docs.exists():
            return []

        query_tokens = tokenize(query)
        if not query_tokens:
            return []
        query_tf = compute_tf(query_tokens)

        scored_results = []
        for doc in active_docs:
            # Score against title and content
            full_text = f"{doc.document_name} {doc.category} {doc.content_text}"
            doc_tokens = tokenize(full_text)
            doc_tf = compute_tf(doc_tokens)
            
            score = cosine_similarity_dict(query_tf, doc_tf)
            
            # Boost if keyword appears explicitly in document title
            for q_tok in query_tokens:
                if q_tok in doc.document_name.lower():
                    score += 0.25
                if q_tok in doc.content_text.lower():
                    score += 0.1

            if score > 0.05:
                # Find best matching paragraph/chunk for excerpt
                paragraphs = [p.strip() for p in doc.content_text.split('\n') if len(p.strip()) > 30]
                best_excerpt = ""
                best_p_score = -1
                for p in paragraphs:
                    p_tf = compute_tf(tokenize(p))
                    p_score = cosine_similarity_dict(query_tf, p_tf)
                    if p_score > best_p_score:
                        best_p_score = p_score
                        best_excerpt = p

                scored_results.append({
                    'id': doc.id,
                    'document_name': doc.document_name,
                    'document_type': doc.document_type,
                    'category': doc.category,
                    'vector_id': doc.vector_id,
                    'score': round(float(score), 3),
                    'excerpt': best_excerpt or doc.content_summary or doc.content_text[:250],
                    'citation': f"[{doc.document_type}: {doc.document_name}]"
                })

        scored_results.sort(key=lambda x: x['score'], reverse=True)
        return scored_results[:top_k]
