import { Card, Typography, Image, Flex } from "antd";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Product } from "@/types/product";

type ProductItemProps = Product;

const ProductItem = ({ id, title, thumbnail, images }: ProductItemProps) => {
  const [imagesToPreview, setImagesToPreview] = useState<string[]>([]);

  return (
    <Card style={{ margin: 20 }} hoverable key={id}>
      <Flex vertical align="center" justify="center">
        <Image
          alt="product thumbnail"
          data-testid="product-thumbnail"
          src={thumbnail}
          preview={{ visible: false }}
          onClick={() => {
            console.log("clicked");
            setImagesToPreview(images);
          }}
        />
        <Typography.Text data-testid="product-title">{title}</Typography.Text>
      </Flex>
      {imagesToPreview.length > 0
        ? createPortal(
            <Image.PreviewGroup
              preview={{
                visible: true,
                onVisibleChange: (value) => {
                  if (!value) setImagesToPreview([]);
                },
              }}
            >
              {imagesToPreview.map((image, index) => {
                return (
                  <Image
                    key={index}
                    src={image}
                    alt="product preview image"
                  ></Image>
                );
              })}
            </Image.PreviewGroup>,
            document.body
          )
        : null}
    </Card>
  );
};

export default ProductItem;
