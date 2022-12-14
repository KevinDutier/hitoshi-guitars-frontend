import styles from "../styles/Category.module.css";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";

import { Popover, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";

export default function electric() {
  // const router = useRouter();

  const [searchParameter, setSearchParameter] = useState("byPopularity");
  const [guitars, setGuitars] = useState([]);
  const [productCard, setProductCard] = useState(<></>); // before the search result comes, product card is empty
  const [anchorEl, setAnchorEl] = useState(null); // popover menu anchor

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

  function sortPopover() {
    return (
      <>
        <p className={styles.sortBy}>sort by:</p>
        <FontAwesomeIcon
          className={styles.popoverIcon}
          icon={faSort}
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
          <Typography
            className={styles.popoverItem}
            onClick={() => {
              setSearchParameter("byPopularity");
              closePopover();
            }}
          >
            popularity
          </Typography>
          <Typography
            className={styles.popoverItem}
            onClick={() => {
              setSearchParameter("byBrand");
              closePopover();
            }}
          >
            brand (A-Z)
          </Typography>
          <Typography
            className={styles.popoverItemLast}
            onClick={() => {
              setSearchParameter("byPrice");
              closePopover();
            }}
          >
            price (low to high)
          </Typography>
        </Popover>
      </>
    );
  }

  // search function executed upon loading the page
  async function search() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/articles/search/electric/${searchParameter}`
    );
    const request = await res.json();

    // search for guitars, then set guitars to the result of the search
    setGuitars(request.searchResult);
  }

  useEffect(() => {
    // execute search function once upon loading the page, and then when searchParameter is updated
    search();
  }, [searchParameter]);

  // once guitars or searchParameter has been updated, display results on the page
  useEffect(() => {
    setProductCard(<ProductCard guitars={guitars} />);
  }, [guitars, searchParameter]);

  return (
    <>
      <Header />
      {sortPopover()}
      {productCard}
    </>
  );
}
