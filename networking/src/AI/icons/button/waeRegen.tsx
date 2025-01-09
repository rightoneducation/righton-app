// wrapping SVG in a ReactComponent because symlinking SVGs gets complicated in terms of webpack etc
export default function waeRegenIcon(){
  return (
    <div>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M17.3643 1.63672V6.09294H12.9432" 
          stroke="white" 
          stroke-width="3" 
          stroke-linecap="round"
        />
        <path 
          d="M16.8495 5.95964C15.2579 2.98905 11.9305 2.15538 10.0201 2.16811C7.99673 2.16811 2.2915 3.15466 2.2915 9.89561C2.2915 16.6366 7.74785 18.514 10.3658 18.514C15.5936 18.514 18.1669 14.7638 18.1669 11.8231" 
          stroke="white" 
          stroke-width="3" 
          stroke-linecap="round"
        />
      </svg>
    </div>
  );
};