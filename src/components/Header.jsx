import { CheckSquare } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 text-white shadow-lg">
          <CheckSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Project Tasks Checklist Matrix
          </h1>
          <p className="text-slate-600">
            At-a-glance view of progress across your project portfolio. Click any cell to toggle completion.
          </p>
        </div>
      </div>
    </header>
  );
}
