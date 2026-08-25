import { useEffect, useState } from 'react'
import { ChevronDown, Edit2, HelpCircle, Plus, Trash2, X } from 'lucide-react'
import { Popconfirm } from 'antd'
import { SearchingInput } from '../../components/share'
import { useCreateFaq, useDeleteFaq, useFaqs, useUpdateFaq } from '../../hooks/useFaq'
import type { FaqItem } from '../../types/faq'

export default function Faqs() {
  const { data: faqsList, isLoading } = useFaqs()
  const createFaq = useCreateFaq()
  const updateFaq = useUpdateFaq()
  const deleteFaq = useDeleteFaq()

  const [search, setSearch] = useState('')
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({})

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null)
  const [questionInput, setQuestionInput] = useState('')
  const [answerInput, setAnswerInput] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!showModal) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handleKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prevOverflow
    }
  }, [showModal])

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const openAddModal = () => {
    setEditingFaq(null)
    setQuestionInput('')
    setAnswerInput('')
    setFormError(null)
    setShowModal(true)
  }

  const openEditModal = (faq: FaqItem) => {
    setEditingFaq(faq)
    setQuestionInput(faq.question || '')
    setAnswerInput(faq.answer || '')
    setFormError(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingFaq(null)
    setQuestionInput('')
    setAnswerInput('')
    setFormError(null)
  }

  const handleSubmitForm = () => {
    const question = questionInput.trim()
    const answer = answerInput.trim()

    if (!question) {
      setFormError('Question is required.')
      return
    }
    if (!answer) {
      setFormError('Answer is required.')
      return
    }

    if (editingFaq) {
      updateFaq.mutate(
        { id: editingFaq._id, payload: { question, answer } },
        {
          onSuccess: () => {
            closeModal()
          },
        }
      )
    } else {
      createFaq.mutate(
        { question, answer },
        {
          onSuccess: () => {
            closeModal()
          },
        }
      )
    }
  }

  const filteredFaqs = (faqsList || []).filter((item) => {
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return (
      item.question.toLowerCase().includes(term) ||
      item.answer.toLowerCase().includes(term)
    )
  })

  return (
    <div className="flex flex-col gap-6 pb-6">
      <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SearchingInput
            value={search}
            onChange={setSearch}
            placeholder="Search FAQs by question or answer..."
            className="w-full max-w-md"
          />

          <button
            type="button"
            onClick={openAddModal}
            className="flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-brand to-brand-hover px-4 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <Plus size={16} />
            Add FAQ
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        {isLoading ? (
          <div className="rounded-2xl border border-surface-border bg-surface-card p-8 text-center text-sm text-gray-400">
            Loading FAQs...
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="rounded-2xl border border-surface-border bg-surface-card p-12 text-center">
            <HelpCircle size={40} className="mx-auto text-gray-500" />
            <h4 className="mt-3 text-base font-medium text-white">No FAQs found</h4>
            <p className="mt-1 text-xs text-gray-400">
              {search.trim()
                ? 'Try matching a different search keyword.'
                : 'Click "Add FAQ" above to create your first FAQ entry.'}
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds[faq._id] ?? true

            return (
              <div
                key={faq._id}
                className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card transition-all"
              >
                <div
                  onClick={() => toggleAccordion(faq._id)}
                  className="flex cursor-pointer items-center justify-between gap-4 p-5 hover:bg-surface-elevated/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                      <HelpCircle size={18} />
                    </span>
                    <h3 className="text-base font-semibold text-white">{faq.question}</h3>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => openEditModal(faq)}
                      aria-label="Edit FAQ"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-brand/15 hover:text-brand"
                    >
                      <Edit2 size={16} />
                    </button>

                    <Popconfirm
                      title="Delete FAQ"
                      description="Are you sure you want to delete this FAQ?"
                      onConfirm={() => deleteFaq.mutate(faq._id)}
                      okText="Yes, Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <button
                        type="button"
                        disabled={deleteFaq.isPending}
                        aria-label="Delete FAQ"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-accent-danger/15 hover:text-accent-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Popconfirm>

                    <button
                      type="button"
                      onClick={() => toggleAccordion(faq._id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:text-white"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-surface-border px-5 py-4 text-sm text-gray-300 leading-relaxed bg-surface-elevated/20">
                    <div className="whitespace-pre-wrap">{faq.answer}</div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </section>

      {/* Add / Edit FAQ Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="faq-modal-title"
            className="w-full max-w-lg rounded-2xl border border-surface-border bg-surface-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-surface-border px-6 py-4">
              <div>
                <h3 id="faq-modal-title" className="text-base font-semibold text-white">
                  {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {editingFaq
                    ? 'Update the question and answer below.'
                    : 'Add a new Frequently Asked Question entry.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                handleSubmitForm()
              }}
              className="space-y-4 px-6 py-5"
            >
              <label className="block">
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Question
                </span>
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => {
                    setQuestionInput(e.target.value)
                    if (formError) setFormError(null)
                  }}
                  placeholder="e.g. How does partner pairing work?"
                  autoFocus
                  className="mt-2 h-11 w-full rounded-md border border-surface-border bg-surface-elevated px-3 text-sm text-white placeholder:text-gray-500 focus:border-brand focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Answer
                </span>
                <textarea
                  value={answerInput}
                  onChange={(e) => {
                    setAnswerInput(e.target.value)
                    if (formError) setFormError(null)
                  }}
                  placeholder="Provide a clear and detailed answer..."
                  rows={5}
                  className="mt-2 w-full rounded-md border border-surface-border bg-surface-elevated p-3 text-sm text-white placeholder:text-gray-500 focus:border-brand focus:outline-none"
                />
              </label>

              {formError && (
                <div className="rounded-md border border-accent-danger/40 bg-accent-danger/10 px-3 py-2 text-xs text-accent-danger">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 rounded-md border border-surface-border bg-surface-elevated px-4 text-sm text-gray-200 transition-colors hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !questionInput.trim() ||
                    !answerInput.trim() ||
                    createFaq.isPending ||
                    updateFaq.isPending
                  }
                  className="h-10 rounded-md bg-gradient-to-r from-brand to-brand-hover px-5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createFaq.isPending || updateFaq.isPending
                    ? 'Saving...'
                    : editingFaq
                    ? 'Update FAQ'
                    : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
