import styles from "../styles/ProductCard.module.css";
import { TailSpin } from "react-loader-spinner";
import { useRouter } from "next/router";


export default function ProductCard(props) {
  const router = useRouter();
  const guitars = props.guitars;

  function toArticlePage(i) {
    router.push({pathname: "./article", query: guitars[i]}, `/article`)
  };

  // as long as guitars.length = 0, return spinner
  if (!guitars.length)
    return (
      <div className={styles.message}>
        <TailSpin
          height="120"
          color="black"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );

  // maps one guitar card per guitar
  const guitarMap = guitars.map((guitar, i) => {
    // capitalizes first letter
    const brandFormatted =
      guitar?.brand.charAt(0).toUpperCase() + guitar?.brand.slice(1);

    return (
      <div className={styles.card} key={i} >
          <div className={styles?.cardInfo} onClick={() => toArticlePage(i)} >
          <img className={styles.image} src={guitar?.img} />
            <h2 className={styles.brand}>{brandFormatted}</h2>
            <h3 className={styles.model}>{guitar?.model}</h3>
            <p className={styles.price}>{guitar?.price} €</p>
          </div>
      </div>
    );
  });

  return <div className={styles.container}>{guitarMap}</div>;
}
