import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@mui/material';
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryLine,
  VictoryLabel,
} from 'victory';

interface QualityChartProps {
  data: { version: string, numberOfDismissedExplanations: number, quality: number }[];
}

export default function QualityChart({
  data
}: QualityChartProps) {
  // const data = [
  //   {version: '0.1.0', quality: 0.25},
  //   {version: '0.1.1', quality: 0.5},
  //   {version: '0.1.2', quality: 0.9},
  // ]
  
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useRef(null);
  const barThickness = 18;
  const barThicknessZero = 26;

  useEffect(() => {
    const handleResize = () => {
      const node: any = graphRef.current;
      if (node) {
        const { width } = node.getBoundingClientRect();
        setBoundingRect((prevRect) => ({
          ...prevRect,
          width,
        }));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (

    <div style={{ 
      textAlign: 'center',
      width: '100%',
      maxWidth: '500px'
    }}>
      <div ref={graphRef}>
        {data.length > 1 && (
          <>
            <VictoryChart
              domainPadding={{ x: 36, y: 0 }}
              padding={{ top: 20, bottom: 60, left: 60, right: 90 }}
            >
             <VictoryLine
              data={data}
              x="quality"
              y="version"
              horizontal
              standalone={false}
              interpolation="natural"
              animate={{
                onLoad: { duration: 200 },
                duration: 200,
              }}
            />
            <VictoryAxis
              dependentAxis
              axisLabelComponent={<VictoryLabel dy={12} />}
              label="Version"
            />
            <VictoryAxis
              axisLabelComponent={<VictoryLabel dy={-20} />}
              label="Quality"
            />
          </VictoryChart>
          </>
        )}
 
      </div>
    </div>
  );
}