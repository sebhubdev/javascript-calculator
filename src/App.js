import './assets/css/App.css';
import Calculator from './components/calculator';
import Header from './components/header';
import Footer from './components/footer';

function App() {
  return (
    <div className="App">
      <Header/>
      <Calculator/>
      <div id="credits">By Sebastian Neumann</div>
      <Footer/>
    </div>
  );
}

export default App;
