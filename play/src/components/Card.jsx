import React from 'react';

const Card = ({ extraStyle, children }) => {
  const cardStyle = { ...(extraStyle || {}), ...styles.cardContent };
  return (
    <div style={styles.cardContainer}>
      <div style={cardStyle}>
        {children}
      </div>
    </div>
  );
};

export default Card;

const styles = {
  cardContainer: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 5px rgba(0, 0, 0, 0.2)',
    borderRadius: '24px',
    marginLeft: '40px',
    marginRight: '40px',
    marginTop: '40px',
  },
  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
};