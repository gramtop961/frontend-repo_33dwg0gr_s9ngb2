import { useMemo, useState } from 'react';

// Utility to generate initial data (7 projects x 7 tasks)
function generateInitialData(projectCount = 7, taskCount = 7) {
  const projects = Array.from({ length: projectCount }, (_, i) => ({
    id: `project-${i + 1}`,
    name: `Project ${i + 1}`,
    // simple emoji identifiers for quick visual tags
    icon: ['🚀','📦','🛠️','🎯','📊','💡','⚙️','🧪','🌐','🔐'][i % 10],
  }));

  const tasks = Array.from({ length: taskCount }, (_, i) => ({
    id: `task-${i + 1}`,
    name: `Task ${i + 1}`,
  }));

  const status = {};
  projects.forEach(p => {
    status[p.id] = {};
    tasks.forEach(t => {
      // randomly seed a mix of complete/incomplete to show variety
      status[p.id][t.id] = Math.random() > 0.5;
    });
  });

  return { projects, tasks, status };
}

export default function MatrixTable() {
  const { projects: initialProjects, tasks: initialTasks, status: initialStatus } = useMemo(() => generateInitialData(8, 7), []);
  const [projects] = useState(initialProjects);
  const [tasks] = useState(initialTasks);
  const [status, setStatus] = useState(initialStatus);

  const toggleCell = (projectId, taskId) => {
    setStatus(prev => ({
      ...prev,
      [projectId]: { ...prev[projectId], [taskId]: !prev[projectId][taskId] },
    }));
  };

  // Calculate per-project completion for summary chips
  const projectCompletion = useMemo(() => {
    return projects.map(p => {
      const completed = tasks.reduce((acc, t) => acc + (status[p.id]?.[t.id] ? 1 : 0), 0);
      const total = tasks.length;
      return { id: p.id, completed, total, pct: Math.round((completed / total) * 100) };
    });
  }, [projects, tasks, status]);

  // Calculate per-task completion to spot common gaps
  const taskCompletion = useMemo(() => {
    return tasks.map(t => {
      const completed = projects.reduce((acc, p) => acc + (status[p.id]?.[t.id] ? 1 : 0), 0);
      const total = projects.length;
      return { id: t.id, completed, total, pct: Math.round((completed / total) * 100) };
    });
  }, [projects, tasks, status]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
              <th className="sticky left-0 z-10 text-left font-semibold px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600">
                Projects
              </th>
              {tasks.map((t, idx) => (
                <th key={t.id} className="font-semibold px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/20 text-white font-medium">
                      {idx + 1}
                    </span>
                    <span>{t.name}</span>
                    <span className="text-white/70 text-xs">({taskCompletion[idx].pct}% complete)</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="even:bg-slate-50">
                <td className="sticky left-0 z-[1] bg-white even:bg-slate-50 px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span className="text-xl" aria-hidden>{p.icon}</span>
                    <div>
                      <div className="font-medium text-slate-800">{p.name}</div>
                      <div className="text-xs text-slate-500">
                        {projectCompletion.find(pc => pc.id === p.id)?.completed}/{tasks.length} done
                      </div>
                    </div>
                  </div>
                </td>
                {tasks.map((t) => {
                  const done = status[p.id]?.[t.id];
                  return (
                    <td
                      key={`${p.id}-${t.id}`}
                      className="px-4 py-3 text-center"
                    >
                      <button
                        onClick={() => toggleCell(p.id, t.id)}
                        className={`w-8 h-8 inline-flex items-center justify-center rounded-md font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          done
                            ? 'bg-green-100 text-green-600 focus:ring-green-400'
                            : 'bg-red-100 text-red-600 focus:ring-red-400'
                        }`}
                        aria-label={`${p.name} — ${t.name} ${done ? 'completed' : 'incomplete'}`}
                      >
                        {done ? '✓' : '✗'}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Projects nearing completion</h3>
          <div className="flex flex-wrap gap-2">
            {projectCompletion
              .filter(pc => pc.pct >= 70)
              .sort((a, b) => b.pct - a.pct)
              .map(pc => (
                <span key={pc.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  {projects.find(p => p.id === pc.id)?.name}
                  <span className="text-blue-600/70">{pc.pct}%</span>
                </span>
              ))}
            {projectCompletion.filter(pc => pc.pct >= 70).length === 0 && (
              <span className="text-slate-500">No projects near completion yet.</span>
            )}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Commonly incomplete tasks</h3>
          <div className="flex flex-wrap gap-2">
            {taskCompletion
              .filter(tc => tc.pct <= 40)
              .sort((a, b) => a.pct - b.pct)
              .map(tc => (
                <span key={tc.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                  {tasks.find(t => t.id === tc.id)?.name}
                  <span className="text-rose-600/70">{tc.pct}%</span>
                </span>
              ))}
            {taskCompletion.filter(tc => tc.pct <= 40).length === 0 && (
              <span className="text-slate-500">No common gaps detected.</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
