import "@/assets/App.css";
import { Input, List, Typography, Space, Flex } from "antd";
import { useEffect, useState, ChangeEvent } from "react";
import ProductItem from "@/components/ProductItem";
import { Product } from "@/types/product";
import { debounce, throttle } from "lodash";
import { SearchOutlined } from "@ant-design/icons";

const LIMIT: number = 20 as const;

function App() {
  const [searchedText, setSearchedText] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [images, setImages] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);

  type FetchParams = {
    limit: number;
    skip?: number;
  };

  useEffect(() => {
    const initImages = async () => {
      setIsLoading(() => true);
      const response = await fetch(
        `https://dummyjson.com/products/search?limit=20&&q=${searchedText}`
      );
      const json = await response.json();
      setImages(() => json.products);
      setPage((prevPage) => prevPage + 1);
      setTotal(() => json.total);
      setIsLoading(() => false);
    };

    setImages(() => []);
    setPage(() => 0);
    setTotal(() => 0);
    initImages();
  }, [searchedText]);

  useEffect(() => {
    const fetchImages = async ({ limit, skip = 0 }: FetchParams) => {
      if (isLoading) return;

      setIsLoading(() => true);
      const response = await fetch(
        `https://dummyjson.com/products/search?limit=${limit}&skip=${skip}&q=${searchedText}`
      );
      const json = await response.json();
      setImages((prevProducts) => [...prevProducts, ...json.products]);
      setPage((prevPage) => prevPage + 1);
      setIsLoading(() => false);
    };
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight > scrollHeight - 100) {
        fetchImages({ limit: LIMIT, skip: page * LIMIT });
      }
    };

    const debouncedHandleScroll = throttle(handleScroll, 300);

    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, [page]);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchedText(() => e.target.value);
  };

  const debouncedOnSearch = debounce(onSearch, 500);

  return (
    <>
      <Flex vertical align="center" style={{ width: "100%" }}>
        <Flex className="app__search-bar" gap={4} vertical align="center">
          <Typography.Title
            style={{ textAlign: "center", fontFamily: "cursive" }}
          >
            Image Gallery
          </Typography.Title>
          <Input
            style={{ maxWidth: 300 }}
            allowClear={true}
            onChange={debouncedOnSearch}
            addonBefore={<SearchOutlined />}
          />
          <Typography.Text>
            Show <Typography.Text strong>{images.length}</Typography.Text> of{" "}
            <Typography.Text strong>{total}</Typography.Text> images
          </Typography.Text>
        </Flex>
        <Space align="center">
          <List
            grid={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }}
            loading={isLoading}
            dataSource={images}
            renderItem={(item) => {
              return (
                <ProductItem
                  id={item.id}
                  title={item.title}
                  thumbnail={item.thumbnail}
                  images={item.images}
                />
              );
            }}
          />
        </Space>
      </Flex>
    </>
  );
}

export default App;