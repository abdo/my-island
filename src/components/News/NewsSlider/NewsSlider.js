import { Carousel } from "antd";
import React from "react";

import "./NewsSlider.css";

const newsSlider = props => {
  let mountedArticlesInSliderCount = 0;

  let articlesSlider = "";
  if (props.articles) {
    articlesSlider = props.articles.map(article => {
      if (
        article.title &&
        article.urlToImage &&
        article.url &&
        article.description &&
        article.publishedAt &&
        mountedArticlesInSliderCount < props.maximumNumberOfArticleInSlider
      ) {
        mountedArticlesInSliderCount++;
        return (
          <div key={article.url}>
            <img
              src={article.urlToImage}
              style={{
                margin: "0 auto",
                height: "40vh",
                width: "100%",
                marginTop: "25px"
              }}
              alt="news"
            />
            <a href={article.url} target="_blank">
              <h3
                style={{
                  zIndex: "10",
                  color: "#fff",
                  marginTop: "5px"
                }}
              >
                {article.title}
              </h3>
            </a>
          </div>
        );
      } else {
        return null;
      }
    });
  }
  return <Carousel autoplay>{articlesSlider}</Carousel>;
};

export default newsSlider;
