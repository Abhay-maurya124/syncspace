import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './App.css'

axios.defaults.withCredentials = true

const Icon = ({ name, size = 18 }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>,
    home: <><path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    chevron: <><path d="m9 18 6-6-6-6"/></>,
    chevronDown: <><path d="m6 9 6 6 6-6"/></>,
    document: <><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/></>,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-1.42 1.42-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V20h-2v-.08a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-1.42-1.42.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.51-1H7v-2h.09A1.65 1.65 0 0 0 8.6 11a1.65 1.65 0 0 0-.33-1.82l-.06-.06 1.42-1.42.06.06A1.65 1.65 0 0 0 11.5 8a1.65 1.65 0 0 0 1-1.51V6h2v.08a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 1.42 1.42-.06.06A1.65 1.65 0 0 0 19.4 11a1.65 1.65 0 0 0 1.51 1H21v2h-.09A1.65 1.65 0 0 0 19.4 15Z"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    dots: <><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></>,
    star: <><path d="m12 2 3 6 7 .9-5 4.8 1.2 6.8-6.2-3.3-6.2 3.3L7 13.7 2 8.9 9 8z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2z"/><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7z"/><path d="m5 13 .6 1.4L7 15l-1.4.6L5 17l-.6-1.4L3 15l1.4-.6z"/></>,
    trash: <><path d="M3 6h18M8 6V3h8v3M19 6l-1 15H6L5 6M10 10v7M14 10v7"/></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Avatar({ name, size = 'md', image }) {
  const initials = (name || 'User').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  return <div className={`avatar avatar-${size}`} style={image ? { backgroundImage: `url(${image})` } : undefined}>{image ? '' : initials}</div>
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        await axios.post('/api/auth/createuser', form)
      }
      const { data } = await axios.post('/api/auth/login', { email: form.email, password: form.password })
      localStorage.setItem('syncspace-user', JSON.stringify(data.user))
      onLogin(data.user)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-brand"><div className="brand-mark">S</div><span>SyncSpace</span></div>
      <section className="auth-card">
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p>{mode === 'login' ? 'Sign in to continue to your workspace.' : 'Start organizing work with your team.'}</p>
        <form onSubmit={submit}>
          {mode === 'register' && (
            <label>Full name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Alex Morgan" required /></label>
          )}
          <label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" required /></label>
          <label>Password<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" required /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button auth-submit" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Continue' : 'Create account'}<span>→</span></button>
        </form>
        <div className="auth-switch">{mode === 'login' ? 'New to SyncSpace?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Create account' : 'Sign in'}</button></div>
      </section>
    </main>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal" onMouseDown={e => e.stopPropagation()}>
        <div className="modal-header"><h2>{title}</h2><button className="icon-button" onClick={onClose}>×</button></div>
        {children}
      </section>
    </div>
  )
}

export default function App() {
  const savedUser = (() => { try { return JSON.parse(localStorage.getItem('syncspace-user')) } catch { return null } })()
  const [user, setUser] = useState(savedUser)
  const [workspaces, setWorkspaces] = useState([])
  const [activeWorkspace, setActiveWorkspace] = useState(null)
  const [documents, setDocuments] = useState([])
  const [activeDocument, setActiveDocument] = useState(null)
  const [loading, setLoading] = useState(Boolean(savedUser))
  const [modal, setModal] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [toast, setToast] = useState('')
  const saveTimer = useRef(null)
  const toastTimer = useRef(null)

  const notify = useCallback((message) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2600)
  }, [])

  useEffect(() => {
    if (!user) return
    axios.get('/api/v1/workspace/getAllWorkspaces')
      .then(({ data }) => {
        setWorkspaces(data.workspaces || [])
        if (data.workspaces?.length) setActiveWorkspace(data.workspaces[0])
      })
      .catch(() => notify('Could not load workspaces'))
      .finally(() => setLoading(false))
  }, [notify, user])

  useEffect(() => {
    if (!activeWorkspace) return
    axios.get(`/api/v2/document/${activeWorkspace._id}/documents`)
      .then(({ data }) => setDocuments(data.documents || []))
      .catch(() => setDocuments([]))
  }, [activeWorkspace])

  const logout = () => {
    localStorage.removeItem('syncspace-user')
    setUser(null)
    setActiveWorkspace(null)
  }

  const createWorkspace = async (event) => {
    event.preventDefault()
    const name = new FormData(event.currentTarget).get('name')?.trim()
    if (!name) return
    try {
      const { data } = await axios.post('/api/v1/workspace/createworkspace', { workspacename: name })
      setWorkspaces(prev => [data.workspace, ...prev])
      setActiveWorkspace(data.workspace)
      setModal(null)
      notify('Workspace created')
    } catch (err) {
      notify(err.response?.data?.message || 'Could not create workspace')
    }
  }

  const createDocument = async () => {
    if (!activeWorkspace) { setModal('workspace'); return }
    try {
      const { data } = await axios.post(`/api/v2/document/${activeWorkspace._id}/documents`, { title: 'Untitled', content: '' })
      setDocuments(prev => [data.document, ...prev])
      setActiveDocument(data.document)
    } catch (err) {
      notify(err.response?.data?.message || 'Could not create document')
    }
  }

  const updateActiveDocument = (patch) => {
    const updated = { ...activeDocument, ...patch }
    setActiveDocument(updated)
    setDocuments(prev => prev.map(doc => doc._id === updated._id ? updated : doc))
    window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(async () => {
      try {
        await axios.put(`/api/v2/document/${updated._id}`, patch)
      } catch {
        notify('Changes could not be saved')
      }
    }, 700)
  }

  const deleteDocument = async () => {
    if (!activeDocument) return
    try {
      await axios.delete(`/api/v2/document/${activeDocument._id}`)
      setDocuments(prev => prev.filter(doc => doc._id !== activeDocument._id))
      setActiveDocument(null)
      notify('Document moved to trash')
    } catch (err) {
      notify(err.response?.data?.message || 'Could not delete document')
    }
  }

  const addMember = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      await axios.post(`/api/v1/workspace/addmember/${activeWorkspace._id}`, { email: form.get('email'), role: form.get('role') })
      setModal(null)
      notify('Member invited')
    } catch (err) {
      notify(err.response?.data?.message || 'Could not invite member')
    }
  }

  const runAI = (prompt) => {
    const source = activeDocument?.content?.trim() || 'This workspace'
    setAiPrompt(prompt)
    if (prompt === 'Summarize') setAiAnswer(`Summary:\n\n${source.slice(0, 180)}${source.length > 180 ? '...' : ''}`)
    else if (prompt === 'Improve writing') setAiAnswer(`Suggested rewrite:\n\n${source || 'Start with a clear idea, add supporting details, and finish with a next step.'}`)
    else setAiAnswer(`I can help you turn these notes into a polished plan. For “${source.slice(0, 60) || 'your document'}”, start with a goal, define three priorities, and add owners and deadlines.`)
  }

  if (!user) return <AuthScreen onLogin={setUser} />

  if (loading) return <div className="loading-screen"><div className="brand-mark">S</div><span>Loading SyncSpace</span></div>

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-top">
          <button className="workspace-switcher" onClick={() => setModal('workspace')}>
            <Avatar name={activeWorkspace?.workspacename || user.name} size="sm" />
            {!sidebarCollapsed && <><div className="switcher-copy"><strong>{activeWorkspace?.workspacename || 'Personal'}</strong><small>{user.name}</small></div><Icon name="chevronDown" size={14}/></>}
          </button>
          {!sidebarCollapsed && <button className="icon-button sidebar-collapse" onClick={() => setSidebarCollapsed(true)} title="Collapse sidebar">‹</button>}
        </div>

        {!sidebarCollapsed && (
          <>
            <nav className="sidebar-nav">
              <button className="nav-item"><Icon name="search" /><span>Search</span><kbd>⌘ K</kbd></button>
              <button className="nav-item" onClick={() => setActiveDocument(null)}><Icon name="home" /><span>Home</span></button>
              <button className="nav-item" onClick={() => setAiOpen(true)}><Icon name="sparkles" /><span>SyncSpace AI</span></button>
            </nav>
            <div className="sidebar-section">
              <div className="section-label"><span>Private</span><button onClick={createDocument} title="New page"><Icon name="plus" size={15}/></button></div>
              <button className="nav-item"><Icon name="clock" /><span>Recent</span></button>
              {documents.slice(0, 6).map(doc => (
                <button key={doc._id} className={`nav-item document-link ${activeDocument?._id === doc._id ? 'active' : ''}`} onClick={() => setActiveDocument(doc)}>
                  <Icon name="document" /><span>{doc.title || 'Untitled'}</span>
                </button>
              ))}
            </div>
            {workspaces.length > 1 && (
              <div className="sidebar-section">
                <div className="section-label"><span>Workspaces</span></div>
                {workspaces.map(workspace => (
                  <button key={workspace._id} className={`nav-item ${activeWorkspace?._id === workspace._id ? 'active' : ''}`} onClick={() => { setActiveWorkspace(workspace); setActiveDocument(null) }}>
                    <span className="workspace-dot">{workspace.workspacename?.[0]?.toUpperCase()}</span><span>{workspace.workspacename}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="sidebar-bottom">
              <button className="nav-item" onClick={() => setModal('members')}><Icon name="people" /><span>Invite members</span></button>
              <button className="nav-item" onClick={() => setModal('settings')}><Icon name="settings" /><span>Settings</span></button>
            </div>
          </>
        )}
        {sidebarCollapsed && (
          <div className="collapsed-actions">
            <button className="icon-button" onClick={() => setSidebarCollapsed(false)} title="Expand sidebar">›</button>
            <button className="icon-button" onClick={createDocument}><Icon name="plus"/></button>
            <button className="icon-button" onClick={() => setAiOpen(true)}><Icon name="sparkles"/></button>
          </div>
        )}
      </aside>

      <main className="main-area">
        {activeDocument ? (
          <>
            <header className="topbar">
              <div className="breadcrumbs"><span>{activeWorkspace?.workspacename}</span><Icon name="chevron" size={14}/><span>{activeDocument.title || 'Untitled'}</span></div>
              <div className="topbar-actions">
                <div className="presence"><Avatar name={user.name} size="sm"/></div>
                <button className="text-button" onClick={() => setModal('members')}>Share</button>
                <button className="icon-button" onClick={() => setAiOpen(true)} title="Ask SyncSpace AI"><Icon name="sparkles"/></button>
                <button className="icon-button" onClick={() => setModal('page')}><Icon name="dots"/></button>
              </div>
            </header>
            <article className="document-page">
              <input className="document-title" value={activeDocument.title || ''} onChange={e => updateActiveDocument({ title: e.target.value })} placeholder="Untitled" />
              <textarea className="document-content" value={activeDocument.content || ''} onChange={e => updateActiveDocument({ content: e.target.value })} placeholder="Type '/' for commands" />
              <div className="page-hint"><span>Saved</span><span>·</span><span>{(activeDocument.content || '').split(/\s+/).filter(Boolean).length} words</span></div>
            </article>
          </>
        ) : (
          <>
            <header className="topbar home-topbar">
              <div className="breadcrumbs"><span>Home</span></div>
              <div className="topbar-actions">
                <button className="icon-button"><Icon name="search"/></button>
                <button className="icon-button"><Icon name="bell"/></button>
                <Avatar name={user.name} size="sm"/>
              </div>
            </header>
            <section className="home-content">
              <div className="home-heading"><div><p>Good morning, {user.name?.split(' ')[0]}</p><h1>Welcome to {activeWorkspace?.workspacename || 'SyncSpace'}</h1></div><button className="icon-button"><Icon name="dots"/></button></div>
              <div className="quick-actions">
                <button onClick={createDocument}><span className="quick-icon"><Icon name="document"/></span><div><strong>New page</strong><small>Start with a blank page</small></div></button>
                <button onClick={() => setModal('workspace')}><span className="quick-icon"><Icon name="people"/></span><div><strong>Create workspace</strong><small>Organize your team</small></div></button>
                <button onClick={() => setAiOpen(true)}><span className="quick-icon ai"><Icon name="sparkles"/></span><div><strong>Ask SyncSpace AI</strong><small>Write, plan or summarize</small></div></button>
              </div>
              <div className="home-section">
                <div className="home-section-header"><h2>Recently edited</h2><button onClick={createDocument}><Icon name="plus" size={15}/> New</button></div>
                {documents.length ? (
                  <div className="document-grid">
                    {documents.map(doc => (
                      <button className="document-card" key={doc._id} onClick={() => setActiveDocument(doc)}>
                        <div className="document-card-icon"><Icon name="document" size={20}/></div>
                        <strong>{doc.title || 'Untitled'}</strong>
                        <small>Edited recently</small>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state"><div className="empty-icon"><Icon name="document" size={24}/></div><h3>No pages yet</h3><p>Create your first page and turn this workspace into a shared knowledge base.</p><button className="primary-button" onClick={createDocument}><Icon name="plus" size={16}/> Create a page</button></div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {aiOpen && (
        <aside className="ai-panel">
          <div className="ai-header"><div><span className="ai-mark"><Icon name="sparkles" size={16}/></span><strong>SyncSpace AI</strong></div><button className="icon-button" onClick={() => setAiOpen(false)}>×</button></div>
          <div className="ai-content">
            <div className="ai-greeting"><div className="ai-mark large"><Icon name="sparkles"/></div><h3>How can I help?</h3><p>Ask a question or turn your ideas into action.</p></div>
            <div className="ai-actions">
              {['Summarize', 'Improve writing', 'Create action items'].map(action => <button key={action} onClick={() => runAI(action)}>{action}</button>)}
            </div>
            {aiAnswer && <div className="ai-answer">{aiAnswer}</div>}
          </div>
          <form className="ai-input" onSubmit={e => { e.preventDefault(); runAI(aiPrompt || 'Help me with this') }}>
            <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Ask anything..." />
            <button type="submit" aria-label="Send">↑</button>
          </form>
        </aside>
      )}

      {modal === 'workspace' && (
        <Modal title="Create a workspace" onClose={() => setModal(null)}>
          <form className="modal-form" onSubmit={createWorkspace}>
            <label>Workspace name<input name="name" placeholder="Acme team" required /></label>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>Cancel</button><button className="primary-button">Create workspace</button></div>
          </form>
        </Modal>
      )}
      {modal === 'members' && (
        <Modal title="Share workspace" onClose={() => setModal(null)}>
          <form className="modal-form" onSubmit={addMember}>
            <label>Email address<input type="email" name="email" placeholder="teammate@company.com" required /></label>
            <label>Role<select name="role" defaultValue="Editor"><option value="Editor">Editor</option><option value="Viewer">Viewer</option><option value="Admin">Admin</option></select></label>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>Cancel</button><button className="primary-button">Invite</button></div>
          </form>
        </Modal>
      )}
      {modal === 'page' && (
        <Modal title="Page actions" onClose={() => setModal(null)}>
          <div className="page-actions">
            <button onClick={async () => { await navigator.clipboard?.writeText(window.location.href); notify('Link copied'); setModal(null) }}><Icon name="copy"/>Copy link</button>
            <button onClick={deleteDocument}><Icon name="trash"/>Move to trash</button>
          </div>
        </Modal>
      )}
      {modal === 'settings' && (
        <Modal title="Settings" onClose={() => setModal(null)}>
          <div className="settings-profile"><Avatar name={user.name} size="lg"/><div><strong>{user.name}</strong><small>{user.email}</small></div></div>
          <button className="danger-button" onClick={logout}><Icon name="logout"/>Log out</button>
        </Modal>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
