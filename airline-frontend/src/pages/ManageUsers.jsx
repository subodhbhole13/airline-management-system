import { useState, useEffect } from 'react'
import { getAllUsers } from '../services/adminService'
import Navbar from '../components/Navbar'
import '../css/ManageUsers.css'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        const data = res.data.data || []
        setUsers(data)
        setFiltered(data)
      })
      .catch(() => console.error('Failed to fetch users'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(users)
      return
    }
    const q = search.toLowerCase()
    setFiltered(
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      )
    )
  }, [search, users])

  return (
    <div className="mu-page">
      <Navbar />
      <div className="mu-container">
        <div className="mu-header">
          <div>
            <h1>Manage Users</h1>
            <p>{filtered.length} user{filtered.length !== 1 ? 's' : ''} registered</p>
          </div>
        </div>

        <div className="mu-filters">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="table-skeleton" />
        ) : filtered.length === 0 ? (
          <div className="no-data">
            <span>👤</span>
            <p>No users found</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id}>
                    <td className="text-muted">{i + 1}</td>
                    <td>
                      <div className="user-row">
                        <div className="user-avatar">{u.name?.charAt(0).toUpperCase()}</div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-gold' : 'badge-blue'}`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
