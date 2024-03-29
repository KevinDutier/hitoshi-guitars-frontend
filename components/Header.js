import styles from "../styles/Header.module.css";
import AboutPopup from "./AboutPopup";
import SearchBar from "./SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Popover, Typography } from "@mui/material";
import { useState } from "react";

// redux imports
import { useDispatch } from "react-redux";
import { removeArticle } from "../reducers/cart";
import { removeArticlePrice, resetCartTotal } from "../reducers/cartTotal";
import { useSelector } from "react-redux";

// header, displayed at the top of each page
export default function Header() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.value);
  const cartTotal = useSelector((state) => state.cartTotal.value);
  const [anchorEl, setAnchorEl] = useState(null);  // popover menu anchor

  // opens the popover
  function openPopover(event) {
    // sets the popover's anchor to the cart icon
    setAnchorEl(event.currentTarget);
  }

  // closes the popover
  function closePopover() {
    // sets anchor to null
    setAnchorEl(null);
  }

  // passes the article's index and dispatches the function from the reducer (remove)
  function handleRemoveClick(props, index) {
    dispatch(removeArticle(index));  // remove article from cart
    dispatch(removeArticlePrice(props));  // remove article price from cart total
    if (cart.length === 1) dispatch(resetCartTotal());  // reset cart total to 0
  }

  // displayed if cart is empty
  const cartEmpty = <p className={styles.emptyCart}>Your cart is empty.</p>;

  // displayed if cart has items: maps the articles from the cart
  const cartArticles = cart.map((article, i) => {
    // capitalizes first letter
    const brandFormatted =
      article?.brand.charAt(0).toUpperCase() + article?.brand.slice(1);

    return (
      <div key={i} className={styles.popoverContainer}>
        <div className={styles.popover}>
          <img className={styles.image} src={article.img[0]} />
          <div className={styles.popoverText}>
            <p className={styles.brand}>{brandFormatted}</p>
            <p className={styles.model}>{article.model}</p>
            <p className={styles.price}>{article.price} €</p>
          </div>
        </div>
          <FontAwesomeIcon
            icon={faCircleXmark}
            className={styles.xIcon}
            onClick={() => handleRemoveClick(article, i)}
          />
      </div>
    );
  });

  // displayed if cart has items: subtotal and order button
  const subtotalAndOrder = <Typography className={styles.popoverLast}>
  <Typography>Subtotal: {cartTotal} €</Typography>
  <Link href="./cartReview">
    <button className={styles.button}>Order</button>
  </Link>
</Typography>

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerItems}>
          <div className={styles.headerItemsLeft}>
            <Link href="./">
              <img className={styles.logo} src="https://i.imgur.com/S9rJ9RD.png" height="50" />
            </Link>
          </div>
            <SearchBar />
          <div className={styles.headerItemsRight}>
            <AboutPopup />
            <FontAwesomeIcon
              className={styles.cart}
              icon={faCartShopping}
              onClick={openPopover}
            />
            <Popover
              open={Boolean(anchorEl)}
              onClose={() => closePopover()}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {cart.length ? cartArticles : cartEmpty} {/* if cart has items, display cartArticles. if cart is empty, display cartEmpty */}
              {cart.length ? subtotalAndOrder: <></> } {/* if cart has items, display subtotalAndOrder. if cart is empty, display nothing */}
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
