export const gradeMap = [
  {
    long: 'High School',
    short: 'HS'
  },
  {
    long: '8th',
    short: '8'
  },
  {
    long: '7th',
    short: '7'
  },
  {
    long: '6th',
    short: '6'
  },
  {
    long: '5th',
    short: '5'
  },
  {
    long: '4th',
    short: '4'
  },
  {
    long: '3rd',
    short: '3'
  },
  {
    long: '2nd',
    short: '2'
  },
  {
    long: '1st',
    short: '1'
  },
  {
    long: 'K',
    short: 'K'
  }
];

export const ccssMap = {
  'K': {
    desc: 'K',
    'CC': {
      desc: 'Counting & Cardinality',
      'A': {
        desc: 'Know number names and the count sequence.',
        '1': { desc: 'Count to 100 by ones and by tens.' },
        '2': { desc: 'Count forward beginning from a given number within the known sequence.' },
        '3': { desc: 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20.' }
      },
      'B': {
        desc: 'Count to tell the number of objects.',
        '4': {
          desc: 'Understand the relationship between numbers and quantities; connect counting to cardinality.',
          'A': { desc: 'When counting objects, say the number names in the standard order.' },
          'B': { desc: 'Understand that the last number name said tells the number of objects counted.' },
          'C': { desc: 'Understand that each successive number name refers to a quantity that is one larger.' }
        },
        '5': { desc: 'Count to answer “how many?” questions about objects arranged in various configurations.' }
      },
      'C': {
        desc: 'Compare numbers.',
        '6': { desc: 'Identify whether the number of objects in one group is greater than, less than, or equal to another group.' },
        '7': { desc: 'Compare two numbers between 1 and 10 presented as written numerals.' }
      }
    },
    'OA': {
      desc: 'Operations and Algebraic Thinking',
      '1': { desc: 'Represent addition and subtraction with objects, fingers, mental images, drawings, sounds, or acting out situations.' },
      '2': { desc: 'Solve addition and subtraction word problems, and add and subtract within 10.' },
      '3': { desc: 'Decompose numbers less than or equal to 10 into pairs in more than one way.' },
      '4': { desc: 'Find the number that makes 10 when added to a given number from 1 to 9.' },
      '5': { desc: 'Fluently add and subtract within 5.' }
    }
  },
  '1': {
    desc: '1st',
    'OA': {
      desc: 'Operations and Algebraic Thinking',
      '1': { desc: 'Use addition and subtraction within 20 to solve word problems with unknowns in all positions.' },
      '2': { desc: 'Solve word problems that call for addition of three whole numbers.' },
      '3': { desc: 'Apply properties of operations as strategies to add and subtract.' },
      '4': { desc: 'Understand subtraction as an unknown-addend problem.' },
      '5': { desc: 'Relate counting to addition and subtraction.' },
      '6': { desc: 'Add and subtract within 20, demonstrating fluency within 10.' },
      '7': { desc: 'Understand the meaning of the equal sign, and determine if equations are true or false.' },
      '8': { desc: 'Determine the unknown whole number in an addition or subtraction equation relating three numbers.' }
    },
    'NBT': {
      desc: 'Number and Operations in Base Ten',
      '1': { desc: 'Count to 120, starting at any number less than 120.' },
      '2': { desc: 'Understand that the two digits of a two-digit number represent tens and ones.' },
      '3': { desc: 'Compare two-digit numbers using >, =, and < symbols.' },
      '4': { desc: 'Add within 100, using concrete models or drawings and strategies.' },
      '5': { desc: 'Find 10 more or 10 less than a two-digit number without having to count.' },
      '6': { desc: 'Subtract multiples of 10 in the range 10-90 from multiples of 10 in the same range.' }
    },
    'MD': {
      desc: 'Measurement and Data',
      '1': { desc: 'Order three objects by length; compare the lengths of two objects indirectly by using a third object.' },
      '2': { desc: 'Express the length of an object as a whole number of length units.' },
      '3': { desc: 'Tell and write time in hours and half-hours using analog and digital clocks.' },
      '4': { desc: 'Organize, represent, and interpret data with up to three categories.' }
    },
    'G': {
      desc: 'Geometry',
      '1': { desc: 'Distinguish between defining attributes versus non-defining attributes; build and draw shapes to possess defining attributes.' },
      '2': { desc: 'Compose two-dimensional shapes to create a composite shape.' },
      '3': { desc: 'Partition circles and rectangles into two and four equal shares; describe the shares using words like halves, fourths, and quarters.' }
    }
  },
  '2': {
    desc: '2nd',
    'OA': {
      desc: 'Operations and Algebraic Thinking',
      '1': { desc: 'Use addition and subtraction within 100 to solve one- and two-step word problems with unknowns in all positions.' },
      '2': { desc: 'Fluently add and subtract within 20 using mental strategies.' },
      '3': { desc: 'Determine whether a group of objects has an odd or even number of members.' },
      '4': { desc: 'Use addition to find the total number of objects arranged in rectangular arrays.' }
    },
    'NBT': {
      desc: 'Number and Operations in Base Ten',
      '1': { desc: 'Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones.' },
      '2': { desc: 'Count within 1000; skip-count by 5s, 10s, and 100s.' },
      '3': { desc: 'Read and write numbers to 1000 using base-ten numerals, number names, and expanded form.' },
      '4': { desc: 'Compare two three-digit numbers based on meanings of the hundreds, tens, and ones digits.' },
      '5': { desc: 'Fluently add and subtract within 100 using strategies based on place value.' },
      '6': { desc: 'Add up to four two-digit numbers using strategies based on place value.' },
      '7': { desc: 'Add and subtract within 1000, using concrete models or drawings and strategies based on place value.' },
      '8': { desc: 'Mentally add 10 or 100 to a given number 100–900, and mentally subtract 10 or 100 from a given number 100–900.' },
      '9': { desc: 'Explain why addition and subtraction strategies work, using place value and the properties of operations.' }
    },
    'MD': {
      desc: 'Measurement and Data',
      '1': { desc: 'Measure the length of an object by selecting and using appropriate tools.' },
      '2': { desc: 'Measure the length of an object twice, using length units of different lengths for the two measurements.' },
      '3': { desc: 'Estimate lengths using units of inches, feet, centimeters, and meters.' },
      '4': { desc: 'Measure to determine how much longer one object is than another.' },
      '5': { desc: 'Use addition and subtraction within 100 to solve word problems involving lengths that are given in the same units.' },
      '6': { desc: 'Represent whole numbers as lengths from 0 on a number line diagram.' },
      '7': { desc: 'Tell and write time from analog and digital clocks to the nearest five minutes.' },
      '8': { desc: 'Solve word problems involving dollar bills, quarters, dimes, nickels, and pennies.' },
      '9': { desc: 'Generate measurement data by measuring lengths of several objects to the nearest whole unit.' },
      '10': { desc: 'Draw a picture graph and a bar graph to represent a data set with up to four categories.' }
    },
    'G': {
      desc: 'Geometry',
      '1': { desc: 'Recognize and draw shapes having specified attributes, such as a given number of angles or a given number of equal faces.' },
      '2': { desc: 'Partition a rectangle into rows and columns of same-size squares and count to find the total number of them.' },
      '3': { desc: 'Partition circles and rectangles into two, three, or four equal shares, and describe the shares using the words halves, thirds, half of, a third of, etc.' }
    }
  },
  '3': {
    desc: '3rd',
    'OA': {
      desc: 'Operations and Algebraic Thinking',
      '1': { desc: 'Interpret products of whole numbers.' },
      '2': { desc: 'Interpret whole-number quotients of whole numbers.' },
      '3': { desc: 'Use multiplication and division within 100 to solve word problems in situations involving equal groups, arrays, and measurement quantities.' },
      '4': { desc: 'Determine the unknown whole number in a multiplication or division equation relating three numbers.' },
      '5': { desc: 'Apply properties of operations as strategies to multiply and divide.' },
      '6': { desc: 'Understand division as an unknown-factor problem.' },
      '7': { desc: 'Fluently multiply and divide within 100, knowing from memory all products of two one-digit numbers.' },
      '8': { desc: 'Solve two-step word problems using the four operations.' },
      '9': { desc: 'Identify arithmetic patterns and explain them using properties of operations.' }
    },
    'NBT': {
      desc: 'Number and Operations in Base Ten',
      '1': { desc: 'Use place value understanding to round whole numbers to the nearest 10 or 100.' },
      '2': { desc: 'Fluently add and subtract multi-digit whole numbers using the standard algorithm.' },
      '3': { desc: 'Multiply one-digit whole numbers by multiples of 10 in the range 10–90.' }
    },
    'NF': {
      desc: 'Number and Operations—Fractions',
      '1': { desc: 'Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts.' },
      '2': { desc: 'Understand a fraction as a number on the number line; represent fractions on a number line diagram.' },
      '3': { desc: 'Explain equivalence of fractions in special cases, and compare fractions by reasoning about their size.' }
    },
    'MD': {
      desc: 'Measurement and Data',
      '1': { desc: 'Tell and write time to the nearest minute and measure time intervals in minutes.' },
      '2': { desc: 'Measure and estimate liquid volumes and masses of objects using standard units.' },
      '3': { desc: 'Draw a scaled picture graph and a scaled bar graph to represent a data set with several categories.' },
      '4': { desc: 'Generate measurement data by measuring lengths using rulers marked with halves and fourths of an inch.' },
      '5': { desc: 'Recognize area as an attribute of plane figures and understand concepts of area measurement.' },
      '6': { desc: 'Relate area to the operations of multiplication and addition.' },
      '7': { desc: 'Solve real-world and mathematical problems involving perimeters of polygons.' }
    },
    'G': {
      desc: 'Geometry',
      '1': { desc: 'Understand that shapes in different categories may share attributes and that the shared attributes can define a larger category.' },
      '2': { desc: 'Partition shapes into parts with equal areas. Express the area of each part as a unit fraction of the whole.' }
    }
  },
  '4': {
    desc: '4th',
    'OA': {
      desc: 'Operations and Algebraic Thinking',
      '1': { desc: 'Interpret a multiplication equation as a comparison.' },
      '2': { desc: 'Multiply or divide to solve word problems involving multiplicative comparison.' },
      '3': { desc: 'Solve multistep word problems posed with whole numbers and having whole-number answers using the four operations.' },
      '4': { desc: 'Find all factor pairs for a whole number in the range 1–100.' },
      '5': { desc: 'Generate a number or shape pattern that follows a given rule.' }
    },
    'NBT': {
      desc: 'Number and Operations in Base Ten',
      '1': { desc: 'Recognize that in a multi-digit whole number, a digit in one place represents ten times what it represents in the place to its right.' },
      '2': { desc: 'Read and write multi-digit whole numbers using base-ten numerals, number names, and expanded form.' },
      '3': { desc: 'Use place value understanding to round multi-digit whole numbers to any place.' },
      '4': { desc: 'Fluently add and subtract multi-digit whole numbers using the standard algorithm.' },
      '5': { desc: 'Multiply a whole number of up to four digits by a one-digit whole number, and multiply two two-digit numbers.' },
      '6': { desc: 'Find whole-number quotients and remainders with up to four-digit dividends and one-digit divisors.' }
    },
    'NF': {
      desc: 'Number and Operations—Fractions',
      '1': { desc: 'Explain why a fraction a/b is equivalent to a fraction (n × a)/(n × b) by using visual fraction models.' },
      '2': { desc: 'Compare two fractions with different numerators and different denominators.' },
      '3': { desc: 'Understand a fraction a/b with a > 1 as a sum of fractions 1/b.' },
      '4': { desc: 'Apply and extend previous understandings of multiplication to multiply a fraction by a whole number.' }
    },
    'MD': {
      desc: 'Measurement and Data',
      '1': { desc: 'Know relative sizes of measurement units within one system of units.' },
      '2': { desc: 'Use the four operations to solve word problems involving distances, intervals of time, liquid volumes, masses of objects, and money.' },
      '3': { desc: 'Apply the area and perimeter formulas for rectangles in real-world and mathematical problems.' },
      '4': { desc: 'Make a line plot to display a data set of measurements in fractions of a unit.' },
      '5': { desc: 'Recognize angles as geometric shapes that are formed wherever two rays share a common endpoint.' },
      '6': { desc: 'Measure angles in whole-number degrees using a protractor.' }
    },
    'G': {
      desc: 'Geometry',
      '1': { desc: 'Draw points, lines, line segments, rays, angles, and perpendicular and parallel lines.' },
      '2': { desc: 'Classify two-dimensional figures based on the presence or absence of parallel or perpendicular lines, or the presence or absence of angles of a specified size.' },
      '3': { desc: 'Recognize a line of symmetry for a two-dimensional figure as a line across the figure such that the figure can be folded along the line into matching parts.' }
    }
  },
  '5': {
    desc: '5th',
    'OA': {
      desc: 'Operations and Algebraic Thinking',
      '1': { desc: 'Use parentheses, brackets, or braces in numerical expressions, and evaluate expressions with these symbols.' },
      '2': { desc: 'Write simple expressions that record calculations with numbers, and interpret numerical expressions without evaluating them.' }
    },
    'NBT': {
      desc: 'Number and Operations in Base Ten',
      '1': { desc: 'Recognize that in a multi-digit number, a digit in one place represents 10 times as much as it represents in the place to its right and 1/10 of what it represents in the place to its left.' },
      '2': { desc: 'Explain patterns in the number of zeros of the product when multiplying a number by powers of 10.' },
      '3': { desc: 'Read, write, and compare decimals to thousandths.' },
      '4': { desc: 'Use place value understanding to round decimals to any place.' },
      '5': { desc: 'Fluently multiply multi-digit whole numbers using the standard algorithm.' },
      '6': { desc: 'Find whole-number quotients of whole numbers with up to four-digit dividends and two-digit divisors.' },
      '7': { desc: 'Add, subtract, multiply, and divide decimals to hundredths, using concrete models or drawings and strategies based on place value.' }
    },
    'NF': {
      desc: 'Number and Operations—Fractions',
      '1': { desc: 'Add and subtract fractions with unlike denominators (including mixed numbers) by replacing given fractions with equivalent fractions.' },
      '2': { desc: 'Solve word problems involving addition and subtraction of fractions referring to the same whole.' },
      '3': { desc: 'Interpret a fraction as division of the numerator by the denominator (a/b = a ÷ b).' },
      '4': { desc: 'Apply and extend previous understandings of multiplication to multiply a fraction or whole number by a fraction.' },
      '5': { desc: 'Interpret multiplication as scaling (resizing), and explain why multiplying a given number by a fraction greater than 1 results in a product greater than the given number.' },
      '6': { desc: 'Solve real-world problems involving multiplication of fractions and mixed numbers.' },
      '7': { desc: 'Apply and extend previous understandings of division to divide unit fractions by whole numbers and whole numbers by unit fractions.' }
    },
    'MD': {
      desc: 'Measurement and Data',
      '1': { desc: 'Convert among different-sized standard measurement units within a given measurement system.' },
      '2': { desc: 'Make a line plot to display a data set of measurements in fractions of a unit.' },
      '3': { desc: 'Recognize volume as an attribute of solid figures and understand concepts of volume measurement.' },
      '4': { desc: 'Measure volumes by counting unit cubes, using cubic cm, cubic in, cubic ft, and improvised units.' },
      '5': { desc: 'Relate volume to the operations of multiplication and addition, and solve real-world and mathematical problems involving volume.' }
    },
    'G': {
      desc: 'Geometry',
      '1': { desc: 'Graph points on the coordinate plane to solve real-world and mathematical problems.' },
      '2': { desc: 'Classify two-dimensional figures in a hierarchy based on properties.' }
    }
  },
  '6': {
    desc: '6th',
    'RP': {
      desc: 'Ratios and Proportional Relationships',
      '1': { desc: 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.' },
      '2': { desc: 'Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship.' },
      '3': { desc: 'Use ratio and rate reasoning to solve real-world and mathematical problems.' }
    },
    'NS': {
      desc: 'The Number System',
      '1': { desc: 'Interpret and compute quotients of fractions, and solve word problems involving division of fractions by fractions.' },
      '2': { desc: 'Fluently divide multi-digit numbers using the standard algorithm.' },
      '3': { desc: 'Fluently add, subtract, multiply, and divide multi-digit decimals using the standard algorithm for each operation.' },
      '4': { desc: 'Find the greatest common factor of two whole numbers less than or equal to 100 and the least common multiple of two whole numbers less than or equal to 12.' },
      '5': { desc: 'Understand that positive and negative numbers are used together to describe quantities having opposite directions or values.' },
      '6': { desc: 'Understand a rational number as a point on the number line.' },
      '7': { desc: 'Understand ordering and absolute value of rational numbers.' },
      '8': { desc: 'Solve real-world and mathematical problems by graphing points in all four quadrants of the coordinate plane.' }
    },
    'EE': {
      desc: 'Expressions and Equations',
      '1': { desc: 'Write and evaluate numerical expressions involving whole-number exponents.' },
      '2': { desc: 'Write, read, and evaluate expressions in which letters stand for numbers.' },
      '3': { desc: 'Apply the properties of operations to generate equivalent expressions.' },
      '4': { desc: 'Identify when two expressions are equivalent.' },
      '5': { desc: 'Understand solving an equation or inequality as a process of answering a question.' },
      '6': { desc: 'Use variables to represent numbers and write expressions when solving a real-world or mathematical problem.' },
      '7': { desc: 'Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q, and x are all nonnegative rational numbers.' },
      '8': { desc: 'Write an inequality of the form x > c or x < c to represent a constraint or condition in a real-world or mathematical problem.' },
      '9': { desc: 'Represent and analyze quantitative relationships between dependent and independent variables.' }
    },
    'G': {
      desc: 'Geometry',
      '1': { desc: 'Find the area of right triangles, other triangles, special quadrilaterals, and polygons by composing into rectangles or decomposing into triangles and other shapes.' },
      '2': { desc: 'Find the volume of a right rectangular prism with fractional edge lengths by packing it with unit cubes of the appropriate unit fraction edge lengths.' },
      '3': { desc: 'Draw polygons in the coordinate plane given coordinates for the vertices.' },
      '4': { desc: 'Represent three-dimensional figures using nets made up of rectangles and triangles, and use the nets to find the surface area of these figures.' }
    },
    'SP': {
      desc: 'Statistics and Probability',
      '1': { desc: 'Recognize a statistical question as one that anticipates variability in the data related to the question and accounts for it in the answers.' },
      '2': { desc: 'Understand that a set of data collected to answer a statistical question has a distribution which can be described by its center, spread, and overall shape.' },
      '3': { desc: 'Recognize that a measure of center for a numerical data set summarizes all of its values with a single number, while a measure of variation describes how its values vary with a single number.' },
      '4': { desc: 'Display numerical data in plots on a number line, including dot plots, histograms, and box plots.' },
      '5': { desc: 'Summarize numerical data sets in relation to their context.' }
    }
  },
  '7': {
    desc: '7th',
    'RP': {
      desc: 'Ratios and Proportional Relationships',
      '1': { desc: 'Compute unit rates associated with ratios of fractions, including ratios of lengths, areas and other quantities measured in like or different units.' },
      '2': { desc: 'Recognize and represent proportional relationships between quantities.' },
      '3': { desc: 'Use proportional relationships to solve multistep ratio and percent problems.' }
    },
    'NS': {
      desc: 'The Number System',
      '1': { desc: 'Apply and extend previous understandings of addition and subtraction to add and subtract rational numbers.' },
      '2': { desc: 'Apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers.' },
      '3': { desc: 'Solve real-world and mathematical problems involving the four operations with rational numbers.' }
    },
    'EE': {
      desc: 'Expressions and Equations',
      '1': { desc: 'Apply properties of operations as strategies to add, subtract, factor, and expand linear expressions with rational coefficients.' },
      '2': { desc: 'Understand that rewriting an expression in different forms in a problem context can shed light on the problem and how the quantities in it are related.' },
      '3': { desc: 'Solve multi-step real-life and mathematical problems posed with positive and negative rational numbers in any form.' },
      '4': { desc: 'Use variables to represent quantities in a real-world or mathematical problem, and construct simple equations and inequalities to solve problems.' }
    },
    'G': {
      desc: 'Geometry',
      '1': { desc: 'Solve problems involving scale drawings of geometric figures, including computing actual lengths and areas from a scale drawing and reproducing a scale drawing at a different scale.' },
      '2': { desc: 'Draw (freehand, with ruler and protractor, and with technology) geometric shapes with given conditions.' },
      '3': { desc: 'Describe the two-dimensional figures that result from slicing three-dimensional figures, as in plane sections of right rectangular prisms and right rectangular pyramids.' },
      '4': { desc: 'Know the formulas for the area and circumference of a circle and use them to solve problems.' },
      '5': { desc: 'Use facts about supplementary, complementary, vertical, and adjacent angles in a multi-step problem to write and solve simple equations for an unknown angle in a figure.' },
      '6': { desc: 'Solve real-world and mathematical problems involving area, volume, and surface area of two- and three-dimensional objects composed of triangles, quadrilaterals, polygons, cubes, and right prisms.' }
    },
    'SP': {
      desc: 'Statistics and Probability',
      '1': { desc: 'Understand that statistics can be used to gain information about a population by examining a sample of the population.' },
      '2': { desc: 'Use data from a random sample to draw inferences about a population with an unknown characteristic of interest.' },
      '3': { desc: 'Informally assess the degree of visual overlap of two numerical data distributions with similar variabilities, measuring the difference between the centers by expressing it as a multiple of a measure of variability.' },
      '4': { desc: 'Use measures of center and measures of variability for numerical data from random samples to draw informal comparative inferences about two populations.' },
      '5': { desc: 'Understand that the probability of a chance event is a number between 0 and 1 that expresses the likelihood of the event occurring.' },
      '6': { desc: 'Approximate the probability of a chance event by collecting data on the chance process that produces it and observing its long-run relative frequency.' },
      '7': { desc: 'Develop a probability model and use it to find probabilities of events.' },
      '8': { desc: 'Find probabilities of compound events using organized lists, tables, tree diagrams, and simulation.' }
    }
  },
  '8': {
    desc: '8th',
    'NS': {
      desc: 'The Number System',
      '1': { desc: 'Know that there are numbers that are not rational, and approximate them by rational numbers.' },
      '2': { desc: 'Apply and extend previous understandings of multiplication and division to divide fractions by fractions.' },
      '3': { desc: 'Compute fluently with multi-digit numbers and find common factors and multiples.' },
      '4': { desc: 'Apply and extend previous understandings of arithmetic to algebraic expressions.' },
      '5': { desc: 'Understand the connections between proportional relationships, lines, and linear equations.' },
      '6': { desc: 'Analyze and solve pairs of simultaneous linear equations.' },
      '7': { desc: 'Apply and extend previous understandings of numbers to the system of rational numbers.' },
      '8': { desc: 'Use properties of rational and irrational numbers.' }
    },
    'EE': {
      desc: 'Expressions and Equations',
      '1': { desc: 'Write and evaluate numerical expressions involving whole-number exponents.' },
      '2': { desc: 'Write, read, and evaluate expressions in which letters stand for numbers.' },
      '3': { desc: 'Apply the properties of operations to generate equivalent expressions.' },
      '4': { desc: 'Identify when two expressions are equivalent.' },
      '5': { desc: 'Understand solving an equation or inequality as a process of reasoning.' },
      '6': { desc: 'Use variables to represent numbers and write expressions when solving a real-world or mathematical problem.' },
      '7': { desc: 'Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q, and x are all nonnegative rational numbers.' },
      '8': { desc: 'Write an inequality of the form x > c or x < c to represent a constraint or condition in a real-world or mathematical problem.' },
      '9': { desc: 'Represent and analyze quantitative relationships between dependent and independent variables.' }
    },
    'F': {
      desc: 'Functions',
      '1': { desc: 'Understand the concept of a function and use function notation.' },
      '2': { desc: 'Interpret functions that arise in applications in terms of the context.' }
    },
    'G': {
      desc: 'Geometry',
      '1': { desc: 'Verify experimentally the properties of rotations, reflections, and translations.' },
      '2': { desc: 'Understand that a two-dimensional figure is congruent to another if the second can be obtained from the first by a sequence of rotations, reflections, and translations.' },
      '3': { desc: 'Describe the effect of dilations, translations, rotations, and reflections on two-dimensional figures using coordinates.' },
      '4': { desc: 'Understand that a two-dimensional figure is similar to another if the second can be obtained from the first by a sequence of rotations, reflections, translations, and dilations.' },
      '5': { desc: 'Use informal arguments to establish facts about the angle sum and exterior angle of triangles.' },
      '6': { desc: 'Explain a proof of the Pythagorean Theorem and its converse.' },
      '7': { desc: 'Apply the Pythagorean Theorem to determine unknown side lengths in right triangles in real-world and mathematical problems.' },
      '8': { desc: 'Apply the Pythagorean Theorem to find the distance between two points in a coordinate system.' },
      '9': { desc: 'Know the formulas for the volumes of cones, cylinders, and spheres and use them to solve real-world and mathematical problems.' }
    },
    'SP': {
      desc: 'Statistics and Probability',
      '1': { desc: 'Construct and interpret scatter plots for bivariate measurement data to investigate patterns of association between two quantities.' },
      '2': { desc: 'Know that straight lines are widely used to model relationships between two quantitative variables.' },
      '3': { desc: 'Interpret the equation y = mx + b as defining a linear function.' }
    }
  },
  'HS': {
    desc: 'High School',
    'N': {
      desc: 'Number and Quantity',
      'RN': {
        desc: 'The Real Number System',
        '1': { desc: 'Extend the properties of exponents to rational exponents.' },
        '2': { desc: 'Classify numbers as rational or irrational.' },
        '3': { desc: 'Explain why the sum or product of two rational numbers is rational.' }
      },
      'Q': {
        desc: 'Quantities',
        '1': { desc: 'Use units as a way to understand problems and to guide the solution of multi-step problems.' },
        '2': { desc: 'Choose and interpret units consistently in formulas.' }
      },
      'CN': {
        desc: 'The Complex Number System',
        '1': { desc: 'Perform operations with complex numbers.' },
        '2': { desc: 'Represent complex numbers on the complex plane.' }
      },
      'VM': {
        desc: 'Vector and Matrix Quantities',
        '1': { desc: 'Perform operations on vectors.' },
        '2': { desc: 'Perform operations on matrices and use them in applications.' }
      }
    },
    'A': {
      desc: 'Algebra',
      'SE': {
        desc: 'Seeing Structure in Expressions',
        '1': { desc: 'Interpret expressions that represent a quantity in terms of its context.' },
        '2': { desc: 'Use the structure of an expression to identify ways to rewrite it.' }
      },
      'AR': {
        desc: 'Arithmetic with Polynomials and Rational Expressions',
        '1': { desc: 'Perform arithmetic operations on polynomials.' },
        '2': { desc: 'Understand the relationship between zeros and factors of polynomials.' }
      },
      'CE': {
        desc: 'Creating Equations',
        '1': { desc: 'Create equations that describe numbers or relationships.' }
      },
      'REI': {
        desc: 'Reasoning with Equations and Inequalities',
        '1': { desc: 'Solve equations and inequalities in one variable.' },
        '2': { desc: 'Solve systems of equations.' }
      }
    },
    'F': {
      desc: 'Functions',
      'IF': {
        desc: 'Interpreting Functions',
        '1': { desc: 'Understand the concept of a function and use function notation.' },
        '2': { desc: 'Interpret functions that arise in applications in terms of the context.' }
      },
      'BF': {
        desc: 'Building Functions',
        '1': { desc: 'Build a function that models a relationship between two quantities.' }
      },
      'LE': {
        desc: 'Linear, Quadratic, and Exponential Models',
        '1': { desc: 'Construct and compare linear, quadratic, and exponential models and solve problems.' }
      },
      'TF': {
        desc: 'Trigonometric Functions',
        '1': { desc: 'Extend the domain of trigonometric functions using the unit circle.' }
      }
    },
    'G': {
      desc: 'Geometry',
      'CO': {
        desc: 'Congruence',
        '1': { desc: 'Experiment with transformations in the plane.' },
        '2': { desc: 'Understand congruence in terms of rigid motions.' }
      },
      'SRT': {
        desc: 'Similarity, Right Triangles, and Trigonometry',
        '1': { desc: 'Understand similarity in terms of similarity transformations.' }
      },
      'C': {
        desc: 'Circles',
        '1': { desc: 'Understand and apply theorems about circles.' }
      },
      'GPE': {
        desc: 'Expressing Geometric Properties with Equations',
        '1': { desc: 'Translate between the geometric description and the equation for a conic section.' }
      },
      'GMD': {
        desc: 'Geometric Measurement and Dimension',
        '1': { desc: 'Explain volume formulas and use them to solve problems.' }
      },
      'MG': {
        desc: 'Modeling with Geometry',
        '1': { desc: 'Apply geometric concepts in modeling situations.' }
      }
    },
    'S': {
      desc: 'Statistics and Probability',
      'ID': {
        desc: 'Interpreting Categorical and Quantitative Data',
        '1': { desc: 'Summarize, represent, and interpret data on a single count or measurement variable.' }
      },
      'IC': {
        desc: 'Making Inferences and Justifying Conclusions',
        '1': { desc: 'Understand and evaluate random processes underlying statistical experiments.' }
      },
      'CP': {
        desc: 'Conditional Probability and the Rules of Probability',
        '1': { desc: 'Understand independence and conditional probability and use them to interpret data.' }
      },
      'MD': {
        desc: 'Using Probability to Make Decisions',
        '1': { desc: 'Calculate expected values and use them to solve problems.' }
      }
    }
  }
};
