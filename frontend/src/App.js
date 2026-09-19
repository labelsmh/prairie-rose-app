import React, {useState, useEffect, useMemo} from 'react';
import './index.css';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [contactDetail, setContactDetail] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [selectedAcademy, setSelectedAcademy] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/students')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch students');
        return res.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const academyOptions = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.status !== 'Active') return;
      (s.academy || []).forEach((a) => set.add(a));
    });
    return Array.from(set).sort();
  }, [students]);

  const yearOptions = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.status !== 'Active') return;
      if (!selectedAcademy || (s.academy || []).includes(selectedAcademy)) {
        if (s.year) set.add(s.year);
      }
    });
    return Array.from(set).sort();
  }, [students, selectedAcademy]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (s.status !== 'Active') return false;
      if (selectedAcademy && !(s.academy || []).includes(selectedAcademy)) return false;
      if (selectedYear && s.year !== selectedYear) return false;
      if (searchTerm && !(s.name || '').toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [students, selectedAcademy, selectedYear, searchTerm]);

  const openContact = async (type, id) => {
    setContactLoading(true);
    setContactDetail({type, loading: true});
    try {
      const res = await fetch(`http://localhost:3001/api/${type}/${id}`);
      const data = await res.json();
      setContactDetail({type, ...data});
    } catch (err) {
      setContactDetail({type, error: 'Failed to load'});
    }
    setContactLoading(false);
  };

  const academyBadgeColor = (academy) => {
    const map = {
      TRADES: 'bg-deepteal/10 text-deepteal',
      HOCKEY: 'bg-sky/15 text-sky',
      'FIRE RESCUE': 'bg-terracotta/20 text-terracotta',
      FLIGHT: 'bg-mauve/15 text-mauve',
      RODEO: 'bg-sage/20 text-sage',
      BASEBALL: 'bg-deepteal/10 text-deepteal',
    };
    return map[academy] || 'bg-deepteal/10 text-deepteal';
  };

  if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center font-sans text-deepteal/60">Loading students...</div>;
  if (error) return <div className="min-h-screen bg-cream flex items-center justify-center font-sans text-terracotta">Error: {error}</div>;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="inline-flex items-center p-2.5 mt-3 ml-4 text-sm text-deepteal/60 rounded-lg sm:hidden hover:bg-deepteal/5"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" clipRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 bg-deepteal`}>
        <div className="overflow-y-auto py-8 px-5 h-full">
          <h2 className="font-sans text-2xl font-bold text-cream px-2 mb-1.5">Prairie Rose</h2>
          <p className="text-xs text-cream/40 px-2 mb-8 tracking-wide uppercase">Student Directory</p>
          <ul className="space-y-1.5">
            <li>
              <a href="#" className="flex items-center p-3 text-sm font-medium text-cream/90 rounded-lg hover:bg-white/5 group">
                <svg className="w-5 h-5 text-cream/40 group-hover:text-cream/70" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <span className="ml-3">Overview</span>
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setPagesOpen(!pagesOpen)}
                className="flex items-center p-3 w-full text-sm font-medium text-cream/90 rounded-lg group hover:bg-white/5"
              >
                <svg className="flex-shrink-0 w-5 h-5 text-cream/40 group-hover:text-cream/70" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
                </svg>
                <span className="flex-1 ml-3 text-left whitespace-nowrap">Academies</span>
                <svg className={`w-4 h-4 text-cream/40 transition-transform ${pagesOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>
              {pagesOpen && (
                <ul className="py-1.5 space-y-1">
                  <li>
                    <button
                      onClick={() => { setSelectedAcademy(''); setSelectedYear(''); }}
                      className={`flex items-center p-2.5 pl-9 w-full text-left text-sm rounded-lg group hover:bg-white/5 ${
                        selectedAcademy === '' ? 'text-terracotta font-semibold' : 'text-cream/70'
                      }`}
                    >
                      All Academies
                    </button>
                  </li>
                  {academyOptions.map((a) => (
                    <li key={a}>
                      <button
                        onClick={() => { setSelectedAcademy(a); setSelectedYear(''); }}
                        className={`flex items-center p-2.5 pl-9 w-full text-left text-sm rounded-lg group hover:bg-white/5 ${
                          selectedAcademy === a ? 'text-terracotta font-semibold' : 'text-cream/70'
                        }`}
                      >
                        {a}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen bg-cream p-8 sm:ml-64 font-sans">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-deepteal mb-8">Student Directory</h1>

          <div className="bg-white border border-deepteal/10 rounded-xl overflow-hidden shadow-sm">

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-6 border-b border-deepteal/10">
              <div className="relative w-full sm:w-64">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-deepteal/40" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-cream/50 border border-deepteal/15 text-deepteal text-sm rounded-lg focus:ring-1 focus:ring-sky focus:border-sky block w-full pl-9 p-3 placeholder:text-deepteal/40"
                  placeholder="Search by name"
                />
              </div>

              <select
                value={selectedAcademy}
                onChange={(e) => {
                  setSelectedAcademy(e.target.value);
                  setSelectedYear('');
                }}
                className="border border-deepteal/15 rounded-lg text-sm p-2.5 bg-white text-deepteal"
              >
                <option value="">All Academies</option>
                {academyOptions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-deepteal/15 rounded-lg text-sm p-2.5 bg-white text-deepteal"
                disabled={yearOptions.length === 0}
              >
                <option value="">All Years</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <span className="text-sm text-deepteal/50 sm:ml-auto self-center">
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-deepteal/80">
                <thead className="text-xs text-deepteal/50 uppercase tracking-wider bg-cream/60">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Academy</th>
                    <th className="px-6 py-4">Year</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedStudent(s)}
                      className="border-b border-deepteal/5 hover:bg-cream/40 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-deepteal whitespace-nowrap">{s.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(s.academy || []).map((a) => (
                            <span key={a} className={`text-xs font-medium px-2.5 py-1 rounded-full ${academyBadgeColor(a)}`}>{a}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">{s.year || '—'}</td>
                      <td className="px-6 py-4">{s.grade || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.status === 'Active' ? 'bg-sage/20 text-sage' : 'bg-deepteal/10 text-deepteal/60'}`}>
                          {s.status || '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-deepteal/40">
                        No students match this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Student detail modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 bg-deepteal/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 border border-deepteal/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-deepteal">{selectedStudent.name}</h2>
              <button onClick={() => setSelectedStudent(null)} className="text-deepteal/30 hover:text-deepteal/60">✕</button>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-deepteal/50">Academy</dt>
                <dd className="text-deepteal font-medium">{(selectedStudent.academy || []).join(', ') || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-deepteal/50">Year</dt>
                <dd className="text-deepteal font-medium">{selectedStudent.year || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-deepteal/50">Grade</dt>
                <dd className="text-deepteal font-medium">{selectedStudent.grade || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-deepteal/50">Status</dt>
                <dd className="text-deepteal font-medium">{selectedStudent.status || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-deepteal/50">Phone</dt>
                <dd className="text-deepteal font-medium">{selectedStudent.phone || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-deepteal/50">Email</dt>
                <dd className="text-deepteal font-medium">{selectedStudent.email || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-deepteal/50">DOB</dt>
                <dd className="text-deepteal font-medium">{selectedStudent.dob || '—'}</dd>
              </div>
            </dl>

            {selectedStudent.guardians && selectedStudent.guardians.length > 0 && (
              <div className="mt-6 pt-5 border-t border-deepteal/10">
                <h3 className="text-xs font-semibold text-deepteal/40 uppercase tracking-wider mb-3">Guardians</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.guardians.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => openContact('guardians', g.id)}
                      className="text-sm bg-sky/10 text-sky px-4 py-2 rounded-lg hover:bg-sky/20 font-medium"
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedStudent.billets && selectedStudent.billets.length > 0 && (
              <div className="mt-6 pt-5 border-t border-deepteal/10">
                <h3 className="text-xs font-semibold text-deepteal/40 uppercase tracking-wider mb-3">Billets</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.billets.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => openContact('billets', b.id)}
                      className="text-sm bg-mauve/10 text-mauve px-4 py-2 rounded-lg hover:bg-mauve/20 font-medium"
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guardian/Billet contact popup */}
      {contactDetail && (
        <div
          className="fixed inset-0 bg-deepteal/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={() => setContactDetail(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 border border-deepteal/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-deepteal">
                {contactDetail.type === 'guardians' ? 'Guardian' : 'Billet'}
              </h2>
              <button onClick={() => setContactDetail(null)} className="text-deepteal/30 hover:text-deepteal/60">✕</button>
            </div>
            {contactLoading ? (
              <p className="text-sm text-deepteal/50">Loading...</p>
            ) : contactDetail.error ? (
              <p className="text-sm text-terracotta">{contactDetail.error}</p>
            ) : (
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-deepteal/50">Name</dt><dd className="font-medium text-deepteal">{contactDetail.name || '—'}</dd></div>
                {contactDetail.type === 'guardians' ? (
                  <>
                    <div className="flex justify-between"><dt className="text-deepteal/50">Phone</dt><dd className="font-medium text-deepteal">{contactDetail.primaryPhone || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-deepteal/50">Email</dt><dd className="font-medium text-deepteal">{contactDetail.primaryEmail || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-deepteal/50">Address</dt><dd className="font-medium text-deepteal text-right">{contactDetail.primaryAddress || '—'}</dd></div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between"><dt className="text-deepteal/50">Relationship</dt><dd className="font-medium text-deepteal">{contactDetail.relationship || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-deepteal/50">Phone</dt><dd className="font-medium text-deepteal">{contactDetail.phone || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-deepteal/50">Email</dt><dd className="font-medium text-deepteal">{contactDetail.email || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-deepteal/50">Address</dt><dd className="font-medium text-deepteal text-right">{contactDetail.address || '—'}</dd></div>
                  </>
                )}
              </dl>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;