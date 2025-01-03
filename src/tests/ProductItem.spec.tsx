import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductItem from "@/components/ProductItem";
import { describe, expect, it } from "vitest";

describe("ProductItem", () => {
  it("should match snapshot", () => {
    const id = "test-id";
    const title = "test-title";
    const thumbnail = "test-thumbnail";
    const images = ["image1.png", "image2.png"];
    const { container } = render(
      <ProductItem
        id={id}
        title={title}
        thumbnail={thumbnail}
        images={images}
      />
    );

    expect(container).toMatchSnapshot();
  });
  it("should render title and thumbnail props if provided", () => {
    const id = "test-id";
    const title = "test-title";
    const thumbnail = "test-thumbnail";
    const images = ["image1.png", "image2.png"];
    render(
      <ProductItem
        id={id}
        title={title}
        thumbnail={thumbnail}
        images={images}
      />
    );

    expect(screen.getByTestId("product-title").innerHTML).toBe("test-title");
    expect(
      screen.getByAltText("product thumbnail").getAttribute("src")
    ).toContain("test-thumbnail");
  });
  it("should render Preview if clicked the thumbnail", async () => {
    const id = "test-id";
    const title = "test-title";
    const thumbnail = "test-thumbnail";
    const images = ["image1.png", "image2.png"];
    render(
      <ProductItem
        id={id}
        title={title}
        thumbnail={thumbnail}
        images={images}
      />
    );

    const thumbnailElement = screen.getByAltText("product thumbnail");
    await fireEvent.click(thumbnailElement);
    expect(screen.getAllByAltText("product preview image").length).toBe(2);
    expect(
      screen.getAllByAltText("product preview image").at(0)
    ).toBeInTheDocument();
    expect(
      screen.getAllByAltText("product preview image").at(1)
    ).toBeInTheDocument();
  });
});
