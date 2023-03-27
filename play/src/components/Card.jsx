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
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 5px rgba(0, 0, 0, 0.2)',
    borderRadius: '24px',
    margin: '50px',
  },
  cardContent: {
    marginLeft: '25px',
    marginRight: '25px',
    marginTop: '10px',
    marginTop: '10px',
  },
};