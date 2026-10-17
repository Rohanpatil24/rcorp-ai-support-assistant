import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { kbService } from '../services/domainServices';
import {
  BookOpen,
  Search,
  Plus,
  FileText,
  Upload,
  Database,
  Tag,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Sparkles,
  X,
  Eye,
  Edit3,
  Calendar,
  Layers,
  HardDrive
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { Loader, EmptyState } from '../components/ui/Feedback';

export const KnowledgeBasePage = () => {
  const { user, isAdmin } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Semantic search test state
  const [semanticQuery, setSemanticQuery] = useState('');
  const [semanticResults, setSemanticResults] = useState(null);
  const [searchingVector, setSearchingVector] = useState(false);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    document_name: '',
    document_type: 'POLICY',
    category: 'Network & Connectivity',
    content_text: '',
  });
  const [uploadLoading, setUploadLoading] = useState(false);

  // Review & Edit Modal state
  const [viewingDoc, setViewingDoc] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    document_name: '',
    document_type: '',
    category: '',
    content_text: '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      const data = await kbService.getDocuments(params);
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch knowledge documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [search, selectedCategory]);

  const handleSemanticSearch = async (e) => {
    e.preventDefault();
    if (!semanticQuery.trim()) return;

    setSearchingVector(true);
    try {
      const res = await kbService.semanticSearch(semanticQuery);
      setSemanticResults(res);
    } catch (err) {
      console.error('Semantic search failed:', err);
    } finally {
      setSearchingVector(false);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    try {
      await kbService.uploadDocument(uploadFormData);
      setShowUploadModal(false);
      setUploadFormData({
        document_name: '',
        document_type: 'POLICY',
        category: 'Network & Connectivity',
        content_text: '',
      });
      fetchDocuments();
    } catch (err) {
      console.error('Document upload failed:', err);
    } finally {
      setUploadLoading(false);
    }
  };

  // Open Document for Review & Edit
  const handleOpenReview = (doc, editMode = false) => {
    setViewingDoc(doc);
    setIsEditing(editMode);
    setEditFormData({
      document_name: doc.document_name,
      document_type: doc.document_type,
      category: doc.category,
      content_text: doc.content_text || doc.content_summary || '',
    });
    setUpdateSuccess(false);
    setUpdateError('');
  };

  // Save updates to Knowledge Base
  const handleUpdateDocument = async (e) => {
    e.preventDefault();
    if (!viewingDoc) return;

    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess(false);

    try {
      const updated = await kbService.updateDocument(viewingDoc.id, {
        document_name: editFormData.document_name,
        document_type: editFormData.document_type,
        category: editFormData.category,
        content_text: editFormData.content_text,
      });

      // Update in state
      setDocuments((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );
      setViewingDoc(updated);
      setUpdateSuccess(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update knowledge document:', err);
      setUpdateError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Failed to save updates. Please try again.'
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this document from the vector index?')) return;
    try {
      await kbService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (viewingDoc?.id === id) {
        setViewingDoc(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    'Network & Connectivity',
    'Billing & Finance',
    'SLA & Governance',
    'Security & Compliance',
    'Engineering & Development',
    'General',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full"
    >
      {/* Responsive Header */}
      <PageHeader
        title="Enterprise Knowledge Base"
        subtitle="Verified corporate SOPs, policy guidelines, and diagnostic manuals indexed for real-time AI citation and RAG retrieval."
        badge="RAG Vector Search Active"
        badgeIcon={Database}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Knowledge Base' },
        ]}
        action={
          isAdmin && (
            <Button
              variant="primary"
              size="md"
              icon={Upload}
              onClick={() => setShowUploadModal(true)}
              className="w-full sm:w-auto"
            >
              Upload Document / Policy
            </Button>
          )
        }
      />

      {/* Live Semantic Vector Search Explorer Widget */}
      <section
        aria-label="Semantic vector search explorer"
        className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-indigo-200 dark:border-indigo-500/25 bg-gradient-to-r from-indigo-50/70 via-slate-50 to-purple-50/50 dark:from-indigo-950/30 dark:via-slate-900/60 dark:to-purple-950/20 space-y-3.5 sm:space-y-4 shadow-sm dark:shadow-none"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Test Vector Semantic Retrieval (RAG)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Enter an unstructured customer problem or query to test how vector embeddings semantically retrieve relevant document paragraphs with cosine similarity scoring.
        </p>

        <form onSubmit={handleSemanticSearch} className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 shrink-0" />
            <input
              type="text"
              value={semanticQuery}
              onChange={(e) => setSemanticQuery(e.target.value)}
              placeholder="e.g. My red optical light is blinking and 3 reboots did not work..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            size="md"
            disabled={searchingVector || !semanticQuery.trim()}
            className="w-full sm:w-auto shrink-0 border-cyan-500/30 hover:border-cyan-500/50 text-indigo-700 dark:text-cyan-300 hover:text-indigo-900 dark:hover:text-white"
          >
            {searchingVector ? 'Searching Vector Space...' : 'Semantic Search'}
          </Button>
        </form>

        {semanticResults && (
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-3 mt-2 shadow-inner">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-indigo-700 dark:text-cyan-300">
                Matched {semanticResults.match_count} Knowledge Documents
              </span>
              <button
                onClick={() => setSemanticResults(null)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xs underline cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2.5">
              {semanticResults.results.map((r, idx) => (
                <div key={idx} className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-1.5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 font-mono text-xs">
                    <span className="text-indigo-600 dark:text-indigo-300 font-bold break-all">{r.citation}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20 shrink-0 self-start sm:self-auto font-sans font-medium">
                      Similarity Score: {r.score}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 italic font-sans leading-relaxed break-words">{r.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Category Filter Tabs */}
      <nav aria-label="Document categories" className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === ''
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border border-indigo-500'
              : 'bg-white dark:bg-slate-900/70 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border border-indigo-500'
                : 'bg-white dark:bg-slate-900/70 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Documents Grid */}
      <section aria-label="Knowledge documents directory">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader message="Loading knowledge documents..." size="md" />
          </div>
        ) : documents.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No knowledge documents found"
            description={
              selectedCategory
                ? `No documents found under the "${selectedCategory}" category.`
                : 'No knowledge documents have been indexed yet.'
            }
            actionLabel={isAdmin ? 'Upload Document' : undefined}
            onAction={isAdmin ? () => setShowUploadModal(true) : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {documents.map((doc) => (
              <motion.article
                key={doc.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-300 dark:hover:border-slate-700/80 transition-all p-5 sm:p-6 flex flex-col justify-between group space-y-4 shadow-sm dark:shadow-none"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/25 uppercase">
                      {doc.document_type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[130px]">
                      ID: {doc.vector_id}
                    </span>
                  </div>

                  <h3
                    onClick={() => handleOpenReview(doc, false)}
                    className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-2 break-words cursor-pointer"
                    title="Click to review document"
                  >
                    {doc.document_name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 break-words">
                    {doc.content_summary || doc.content_text}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <Tag className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400 shrink-0" />
                    <span className="truncate">{doc.category}</span>
                  </div>

                  {/* Actions: Review, Edit, Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenReview(doc, false)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-cyan-500/10 transition-colors"
                      title="Review document"
                      aria-label={`Review ${doc.document_name}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleOpenReview(doc, true)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-indigo-500/10 transition-colors"
                        title="Edit and update document"
                        aria-label={`Edit ${doc.document_name}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        title="Delete document"
                        aria-label={`Delete ${doc.document_name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* REVIEW & EDIT KNOWLEDGE BASE DOCUMENT MODAL */}
      {/* ========================================================================= */}
      {viewingDoc && (
        <Modal
          isOpen={!!viewingDoc}
          onClose={() => setViewingDoc(null)}
          title={isEditing ? 'Edit Knowledge Base Document' : viewingDoc.document_name}
          subtitle={
            isEditing
              ? 'Update document content, category, or metadata. Changes will immediately update vector embeddings.'
              : `Vector ID: ${viewingDoc.vector_id} • Type: ${viewingDoc.document_type} • Category: ${viewingDoc.category}`
          }
          maxWidth="max-w-3xl"
        >
          {updateSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Document updated and re-indexed into vector search successfully!</span>
            </div>
          )}

          {updateError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {updateError}
            </div>
          )}

          {isEditing ? (
            /* EDIT FORM */
            <form onSubmit={handleUpdateDocument} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">Document Title *</label>
                <input
                  type="text"
                  required
                  value={editFormData.document_name}
                  onChange={(e) => setEditFormData({ ...editFormData, document_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Document Format / Type *</label>
                  <select
                    value={editFormData.document_type}
                    onChange={(e) => setEditFormData({ ...editFormData, document_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                  >
                    <option value="POLICY">Company Policy</option>
                    <option value="SOP">Standard Operating Procedure</option>
                    <option value="PDF">PDF Manual</option>
                    <option value="FAQ">FAQ Document</option>
                    <option value="DOCX">Word Document</option>
                    <option value="MANUAL">Product Manual</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Category *</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Document Text Content *</label>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {editFormData.content_text.length} characters
                  </span>
                </div>
                <textarea
                  rows={12}
                  required
                  value={editFormData.content_text}
                  onChange={(e) => setEditFormData({ ...editFormData, content_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-mono leading-relaxed transition-colors"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setIsEditing(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel Edit
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={updateLoading}
                    className="w-full sm:w-auto"
                  >
                    {updateLoading ? 'Saving & Re-indexing...' : 'Save & Update Document'}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            /* REVIEW / READ-ONLY VIEW */
            <div className="space-y-5 text-xs sm:text-sm">
              {/* Document Metadata Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Format</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-300">{viewingDoc.document_type}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Category</span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate block">{viewingDoc.category}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Chunks</span>
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400">{viewingDoc.total_chunks || 1} Chunks</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Estimated Size</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{viewingDoc.file_size_kb || 1} KB</span>
                </div>
              </div>

              {/* Document Summary if present */}
              {viewingDoc.content_summary && (
                <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                    Executive Summary
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                    {viewingDoc.content_summary}
                  </p>
                </div>
              )}

              {/* Full Text Content */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Full Document Body
                </span>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 max-h-96 overflow-y-auto font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-text">
                  {viewingDoc.content_text || viewingDoc.content_summary || 'No text content available.'}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setViewingDoc(null)}
                  className="w-full sm:w-auto"
                >
                  Close Review
                </Button>

                {isAdmin && (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    icon={Edit3}
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto"
                  >
                    Edit & Update Document
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Upload Document Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Knowledge Document / Policy"
        subtitle="Index enterprise knowledge into vector database for real-time RAG citations."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleUploadDocument} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">Document Title *</label>
            <input
              type="text"
              required
              value={uploadFormData.document_name}
              onChange={(e) => setUploadFormData({ ...uploadFormData, document_name: e.target.value })}
              placeholder="e.g. Enterprise Routing Failover SOP v2"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">Document Format / Type *</label>
              <select
                value={uploadFormData.document_type}
                onChange={(e) => setUploadFormData({ ...uploadFormData, document_type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
              >
                <option value="POLICY">Company Policy</option>
                <option value="SOP">Standard Operating Procedure</option>
                <option value="PDF">PDF Manual</option>
                <option value="FAQ">FAQ Document</option>
                <option value="DOCX">Word Document</option>
                <option value="MANUAL">Product Manual</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">Category *</label>
              <select
                value={uploadFormData.category}
                onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">Extracted Policy / Document Text *</label>
            <textarea
              rows={6}
              required
              value={uploadFormData.content_text}
              onChange={(e) => setUploadFormData({ ...uploadFormData, content_text: e.target.value })}
              placeholder="Paste the full text or policy paragraphs to be chunked and indexed into the vector store..."
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-mono transition-colors"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setShowUploadModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={uploadLoading}
              className="w-full sm:w-auto"
            >
              {uploadLoading ? 'Indexing Vector Embeddings...' : 'Index Document in Vector Store'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};
