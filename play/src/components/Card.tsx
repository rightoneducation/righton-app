import React from 'react';

interface CardProps {
  extraStyle?: React.CSSProperties;
  children: React.ReactNode;
  headerTitle?: string;
}

const Card = ({ extraStyle, children }: CardProps) => {
  const cardStyle = { ...(extraStyle || {}), ...styles.cardContent };
  return (
    <div style={styles.cardContainer}>
      <div style={cardStyle as React.CSSProperties}> 
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
  },
  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
};