import Carousel from "react-material-ui-carousel";
import {
  Button,
  Typography,
  Card,
  CardMedia,
  Stack,
  Container,
  TextField,
  Divider,
  Snackbar,
  Slide,
  Alert,
} from "@mui/material";

import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addToWishlist } from "../redux/apiCalls";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const ProductQuickView = ({ productId }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const [response, setResponse] = useState(false);

  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );

  const desc = product.desc.split("\n");

  const user = useSelector((state) => state.user.currentUser);

  const productInfo = {
    productId: product._id,
    title: product.title,
    img: product.img,
    quantity: quantity,
    price: product.price,
    marketPrice: product.marketPrice,
    seller: product.seller,
    hasMerchantReturnPolicy: product.hasMerchantReturnPolicy,
  };

  const handleAddToCart = () => {
    !user && navigate("/login");
    user &&
      user.accountType === 0 &&
      addToCart(user._id, productInfo, dispatch).then((res) => {
        setResponse(res);
      });
  };

  const handleAddToWishlist = () => {
    !user && navigate("/login");
    user &&
      user.accountType === 0 &&
      addToWishlist(user._id, productInfo).then((res) => {
        setResponse(res);
      });
  };

  return (
    <>
      <Container maxWidth="xl">
        <Stack direction="column" spacing={2} justifyContent="space-between">
          <Stack
            alignItems="center"
            justifyContent="space-between"
            sx={{
              backgroundColor: "whitesmoke",
              flex: 2,
            }}
          >
            <Carousel autoPlay={false} sx={{ width: 300, maxHeight: 400 }}>
              <Card>
                <CardMedia
                  height="400"
                  component="img"
                  image={product.img}
                  alt="Image"
                  sx={{ objectFit: "contain" }}
                />
              </Card>
            </Carousel>
          </Stack>
          <Stack
            direction="column"
            justifyContent="flex-start"
            sx={{ height: 500, width: 500, flex: 3 }}
          >
            <Typography variant="h5">
              ৳{product.price} {product.unit ? `/${product.unit}` : ""}
            </Typography>
            <Typography variant="subtitle2">
              only {product.inStock} left In stock
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ marginTop: 5, marginBottom: 2, gap: 5 }}
            >
              {product.inStock ? (
                <TextField
                  type="number"
                  error={
                    quantity < 1 ||
                    quantity > product.inStock ||
                    quantity % 1 !== 0
                  }
                  id="quantity"
                  label="Quantity"
                  value={quantity}
                  size="small"
                  variant="outlined"
                  onChange={(e) => {
                    const value = e.target.valueAsNumber;
                    const validQuantity = value >= 1 ? value : 1;
                    setQuantity(validQuantity);
                  }}
                  sx={{ width: 100 }}
                />
              ) : (
                ""
              )}
              <Stack gap={1}>
                <Button
                  variant="contained"
                  disabled={
                    quantity < 1 ||
                    quantity > product.inStock ||
                    quantity % 1 !== 0
                  }
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>

                <Button
                  variant="outlined"
                  disabled={
                    quantity < 1 ||
                    quantity > product.inStock ||
                    quantity % 1 !== 0
                  }
                  onClick={handleAddToWishlist}
                >
                  Add to Wishlist
                </Button>
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography variant="button">Categories:</Typography>
              {product.cat.map((item) => (
                <Link
                  key={item}
                  to={`/products/${item.value}`}
                  sx={{ mr: 2, textDecoration: "none" }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
            <Typography variant="button">Description:</Typography>
            <Typography variant="body1">
              {desc.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Typography>
            <li>
              Returns:{" "}
              {product.hasMerchantReturnPolicy
                ? "3 day returns | Buyer pays for return shipping."
                : "This product can not be returned."}
            </li>
          </Stack>
          <Stack flex={1} gap={4}>
            <Stack>
              <Typography>Seller Information</Typography>
              <Divider />
              <Typography sx={{ mt: 1 }}>
                {product.seller}
                <Typography variant="caption">
                  {" "}
                  (95% positive feedback)
                </Typography>
                <Link
                  to={`/shop/${product.seller}`}
                  sx={{ ml: 1, textDecoration: "none" }}
                >
                  [Visit Store]
                </Link>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Container>

      {/* Display success or error message */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={Boolean(response)}
        TransitionComponent={SlideTransition}
        autoHideDuration={5000}
        onClose={() => {
          setResponse(false);
        }}
      >
        <Alert
          onClose={() => {
            setResponse(false);
          }}
          severity={response.result}
          sx={{ width: "100%" }}
        >
          {response.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductQuickView;
