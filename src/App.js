import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./Componen/Navbar";
import CartPage from "./Page/Cart";
import Checkout from "./Page/CheckOut";
import DetileProduct from "./Page/DetileProduct";
import LandingPage from "./Page/LandingPage";
import LoginPage from "./Page/LogInPage";
import Transaction from "./Page/UserHistory";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path='/' component={LandingPage}  />
        <Route path='/log-in' component={LoginPage}  />
        <Route path='/detile-product' component={DetileProduct}  />
        <Route path='/cart' component={CartPage}  />
        <Route path='/check-out' component={Checkout}  />
        <Route path='/user-history' component={Transaction}  />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
