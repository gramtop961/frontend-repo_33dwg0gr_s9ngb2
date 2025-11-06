import Header from './components/Header';
import Legend from './components/Legend';
import MatrixTable from './components/MatrixTable';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <Legend />
      <MatrixTable />
      <Footer />
    </div>
  );
}

export default App;
