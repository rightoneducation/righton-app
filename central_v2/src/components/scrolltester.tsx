import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { v4 as uuidv4 } from 'uuid'; // Import UUID

function BasicInfiniteScroll() {
  const [items, setItems] = useState(Array.from({ length: 20 }).map(() => ({ id: uuidv4(), content: 'Item' })));
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    if (items.length >= 100) {
      setHasMore(false);
      return;
    }
    setItems(items.concat(Array.from({ length: 20 }).map(() => ({ id: uuidv4(), content: 'Item' }))));
  };

  return (
    <div id="scrollableDiv" style={{ height: '80vh', overflow: 'auto' }}>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
      >
        {items.map((item) => (
          <div key={item.id} style={{ height: '50px', border: '1px solid #ccc', margin: '5px' }}>
            {item.content}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default BasicInfiniteScroll;
