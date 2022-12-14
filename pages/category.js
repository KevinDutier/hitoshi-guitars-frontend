import styles from "../styles/Category.module.css";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { useRouter } from "next/router";

import { Popover, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";

export default function category() {
  const router = useRouter();

  const [sortBy, setSortBy] = useState("byPopularity");
  const [guitars, setGuitars] = useState([]);
  const [requestResult, setRequestResult] = useState(true);
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
              setSortBy("byPopularity");
              closePopover();
            }}
          >
            popularity
          </Typography>
          <Typography
            className={styles.popoverItem}
            onClick={() => {
              setSortBy("byBrand");
              closePopover();
            }}
          >
            brand (A-Z)
          </Typography>
          <Typography
            className={styles.popoverItemLast}
            onClick={() => {
              setSortBy("byPrice");
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
      `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/articles/search/${router.query.parameter}/${sortBy}`
    );
    const request = await res.json();

    // search for guitars, then set guitars to the result of the search
    setGuitars(request.searchResult);
    setRequestResult(request.result);
  }

  useEffect(() => {
    // execute search function once upon loading the page, and then when sortBy is updated
    search();
  }, [sortBy]);

  // once guitars or sortBy has been updated, display results on the page
  useEffect(() => {
    setProductCard(<ProductCard guitars={guitars} />);
  }, [guitars, sortBy]);

  return (
    <>
      <Header />
      {sortPopover()}
      {requestResult ? productCard : <p className={styles.noResult}>No results were found.</p>}
    </>
  );
}
