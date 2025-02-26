const ccssDictionary = [
  {
    "key": "HS",
    "desc": "High School",
    "domains": [
      {
        "key": "N",
        "desc": "Number and Quantity",
        "clusters": [
          {
            "key": "RN",
            "desc": "The Real Number System",
            "standards": [
              {
                "key": "1",
                "desc": "Explain how the definition of the meaning of rational exponents follows from extending the properties of integer exponents to those values, allowing for a notation for radicals in terms of rational exponents. For example, we define 5^(1/3) to be the cube root of 5 because we want (5^(1/3))^3 = 5."
              },
              {
                "key": "2",
                "desc": "Rewrite expressions involving radicals and rational exponents using the properties of exponents."
              },
              {
                "key": "3",
                "desc": "Explain why the sum or product of two rational numbers is rational; that the sum of a rational number and an irrational number is irrational; and that the product of a nonzero rational number and an irrational number is irrational."
              }
            ]
          },
          {
            "key": "Q",
            "desc": "Quantities",
            "standards": [
              {
                "key": "1",
                "desc": "Use units as a way to understand problems and to guide the solution of multi-step problems; choose and interpret units consistently in formulas; choose and interpret the scale and the origin in graphs and data displays."
              },
              {
                "key": "2",
                "desc": "Define appropriate quantities for the purpose of descriptive modeling."
              },
              {
                "key": "3",
                "desc": "Choose a level of accuracy appropriate to limitations on measurement when reporting quantities."
              }
            ]
          },
          {
            "key": "CN",
            "desc": "The Complex Number System",
            "standards": [
              {
                "key": "1",
                "desc": "Know there is a complex number i such that i² = –1, and every complex number has the form a + bi with a and b real."
              },
              {
                "key": "2",
                "desc": "Use the relation i² = –1 and the commutative, associative, and distributive properties to add, subtract, and multiply complex numbers."
              },
              {
                "key": "3",
                "desc": "Find the conjugate of a complex number; use conjugates to find moduli and quotients of complex numbers."
              },
              {
                "key": "4",
                "desc": "Represent complex numbers on the complex plane in rectangular and polar form (including real and imaginary numbers), and explain why the rectangular and polar forms of a given complex number represent the same number."
              },
              {
                "key": "5",
                "desc": "Represent addition, subtraction, multiplication, and conjugation of complex numbers geometrically on the complex plane; use properties of this representation for computation. For example, (–1 + √3 i)³ = 8 because (–1 + √3 i) has modulus 2 and argument 120°."
              },
              {
                "key": "6",
                "desc": "Calculate the distance between numbers in the complex plane as the modulus of the difference, and the midpoint of a segment as the average of the numbers at its endpoints."
              },
              {
                "key": "7",
                "desc": "Solve quadratic equations with real coefficients that have complex solutions."
              },
              {
                "key": "8",
                "desc": "Extend polynomial identities to the complex numbers. For example, rewrite x² + 4 as (x + 2i)(x – 2i)."
              },
              {
                "key": "9",
                "desc": "Know the Fundamental Theorem of Algebra; show that it is true for quadratic polynomials."
              }
            ]
          },
          {
            "key": "VM",
            "desc": "Vector and Matrix Quantities",
            "standards": [
              {
                "key": "1",
                "desc": "Recognize vector quantities as having both magnitude and direction. Represent vector quantities by directed line segments, and use appropriate symbols for vectors and their magnitudes (e.g., v, |v|, ||v||, v)."
              },
              {
                "key": "2",
                "desc": "Find the components of a vector by subtracting the coordinates of an initial point from the coordinates of a terminal point."
              },
              {
                "key": "3",
                "desc": "Solve problems involving velocity and other quantities that can be represented by vectors."
              },
              {
                "key": "4",
                "desc": "Add and subtract vectors.",
                "subStandards": [
                  {
                    "key": "4a",
                    "desc": "Add vectors end-to-end, component-wise, and by the parallelogram rule. Understand that the magnitude of a sum of two vectors is typically not the sum of the magnitudes."
                  },
                  {
                    "key": "4b",
                    "desc": "Given two vectors in magnitude and direction form, determine the magnitude and direction of their sum."
                  },
                  {
                    "key": "4c",
                    "desc": "Understand vector subtraction v – w as v + (–w), where –w is the additive inverse of w, with the same magnitude as w and pointing in the opposite direction. Represent vector subtraction graphically by connecting the tips in the appropriate order, and perform vector subtraction component-wise."
                  }
                ]
              },
              {
                "key": "5",
                "desc": "Multiply a vector by a scalar.",
                "subStandards": [
                  {
                    "key": "5a",
                    "desc": "Represent scalar multiplication graphically by scaling vectors and possibly reversing their direction; perform scalar multiplication component-wise, e.g., as c(vₓ, v_y) = (cvₓ, cv_y)."
                  },
                  {
                    "key": "5b",
                    "desc": "Compute the magnitude of a scalar multiple cv using ||cv|| = |c|v. Compute the direction of cv knowing that when |c|v ≠ 0, the direction of cv is either along v (for c > 0) or against v (for c < 0)."
                  }
                ]
              },
              {
                "key": "6",
                "desc": "Use matrices to represent and manipulate data, e.g., to represent payoffs or incidence relationships in a network."
              },
              {
                "key": "7",
                "desc": "Multiply matrices by scalars to produce new matrices, e.g., as when all of the payoffs in a game are doubled."
              },
              {
                "key": "8",
                "desc": "Add, subtract, and multiply matrices of appropriate dimensions."
              },
              {
                "key": "9",
                "desc": "Understand that, unlike multiplication of numbers, matrix multiplication for square matrices is not a commutative operation, but still satisfies the associative and distributive properties."
              },
              {
                "key": "10",
                "desc": "Understand that the zero and identity matrices play a role in matrix addition and multiplication similar to the role of 0 and 1 in the real numbers. The determinant of a square matrix is nonzero if and only if the matrix has a multiplicative inverse."
              },
              {
                "key": "11",
                "desc": "Multiply a vector (regarded as a matrix with one column) by a matrix of suitable dimensions to produce another vector. Work with matrices as transformations of vectors."
              },
              {
                "key": "12",
                "desc": "Work with 2 × 2 matrices as transformations of the plane, and interpret the absolute value of the determinant in terms of area."
              }
            ]
          }
        ]
      },
      {
        "key": "A",
        "desc": "Algebra",
        "clusters": [
          {
            "key": "SSE",
            "desc": "Seeing Structure in Expressions",
            "standards": [
              {
                "key": "1",
                "desc": "Interpret expressions that represent a quantity in terms of its context.",
                "subStandards": [
                  {
                    "key": "1a",
                    "desc": "Interpret parts of an expression, such as terms, factors, and coefficients."
                  },
                  {
                    "key": "1b",
                    "desc": "Interpret complicated expressions by viewing one or more of their parts as a single entity. For example, interpret P(1 + r)ⁿ as the product of P and a factor not depending on P."
                  }
                ]
              },
              {
                "key": "2",
                "desc": "Use the structure of an expression to identify ways to rewrite it. For example, see x⁴ – y⁴ as (x²)² – (y²)², thus recognizing it as a difference of squares that can be factored as (x² – y²)(x² + y²)."
              },
              {
                "key": "3",
                "desc": "Choose and produce an equivalent form of an expression to reveal and explain properties of the quantity represented by the expression.",
                "subStandards": [
                  {
                    "key": "3a",
                    "desc": "Factor a quadratic expression to reveal the zeros of the function it defines."
                  },
                  {
                    "key": "3b",
                    "desc": "Complete the square in a quadratic expression to reveal the maximum or minimum value of the function it defines."
                  },
                  {
                    "key": "3c",
                    "desc": "Use the properties of exponents to transform expressions for exponential functions."
                  }
                ]
              },
              {
                "key": "4",
                "desc": "Derive the formula for the sum of a finite geometric series (when the common ratio is not 1), and use the formula to solve problems. For example, calculate mortgage payments."
              }
            ]
          },
          {
            "key": "APR",
            "desc": "Arithmetic with Polynomials and Rational Expressions",
            "standards": [
              {
                "key": "1",
                "desc": "Understand that polynomials form a system analogous to the integers; they are closed under the operations of addition, subtraction, and multiplication."
              },
              {
                "key": "2",
                "desc": "Know and apply the Remainder Theorem: For a polynomial p(x) and a number a, the remainder on division by x – a is p(a)."
              },
              {
                "key": "3",
                "desc": "Identify zeros of polynomials when suitable factorizations are available, and use the zeros to construct a rough graph of the function defined by the polynomial."
              },
              {
                "key": "4",
                "desc": "Prove polynomial identities and use them to describe numerical relationships. For example, the polynomial identity (x² + y²)² = (x² – y²)² + (2xy)² can be used to generate Pythagorean triples."
              },
              {
                "key": "5",
                "desc": "Know and apply the Binomial Theorem for the expansion of (x + y)ⁿ in powers of x and y for a positive integer n."
              },
              {
                "key": "6",
                "desc": "Rewrite simple rational expressions in different forms; write a(x)/b(x) in the form q(x) + r(x)/b(x)."
              },
              {
                "key": "7",
                "desc": "Understand that rational expressions form a system analogous to the rational numbers, closed under addition, subtraction, multiplication, and division by a nonzero rational expression."
              }
            ]
          },
          {
            "key": "CED",
            "desc": "Creating Equations",
            "standards": [
              {
                "key": "1",
                "desc": "Create equations and inequalities in one variable and use them to solve problems."
              },
              {
                "key": "2",
                "desc": "Create equations in two or more variables to represent relationships between quantities; graph equations on coordinate axes with labels and scales."
              },
              {
                "key": "3",
                "desc": "Represent constraints by equations or inequalities, and interpret solutions as viable or non-viable options in a modeling context."
              },
              {
                "key": "4",
                "desc": "Rearrange formulas to highlight a quantity of interest, using the same reasoning as in solving equations."
              }
            ]
          },
          {
            "key": "REI",
            "desc": "Reasoning with Equations and Inequalities",
            "standards": [
              {
                "key": "1",
                "desc": "Explain each step in solving a simple equation as following from the equality of numbers asserted at the previous step."
              },
              {
                "key": "2",
                "desc": "Solve simple rational and radical equations in one variable, and give examples showing how extraneous solutions may arise."
              },
              {
                "key": "3",
                "desc": "Solve linear equations and inequalities in one variable, including equations with coefficients represented by letters."
              },
              {
                "key": "4",
                "desc": "Solve quadratic equations in one variable.",
                "subStandards": [
                  {
                    "key": "4a",
                    "desc": "Use the method of completing the square to transform any quadratic equation in x into an equation of the form (x – p)² = q."
                  },
                  {
                    "key": "4b",
                    "desc": "Solve quadratic equations by inspection, taking square roots, completing the square, the quadratic formula, and factoring."
                  }
                ]
              },
              {
                "key": "5",
                "desc": "Prove that, given a system of two equations in two variables, replacing one equation by the sum of that equation and a multiple of the other produces a system with the same solutions."
              },
              {
                "key": "6",
                "desc": "Solve systems of linear equations exactly and approximately, focusing on pairs of linear equations in two variables."
              },
              {
                "key": "7",
                "desc": "Solve a simple system consisting of a linear equation and a quadratic equation in two variables algebraically and graphically."
              },
              {
                "key": "8",
                "desc": "Represent a system of linear equations as a single matrix equation in a vector variable."
              },
              {
                "key": "9",
                "desc": "Find the inverse of a matrix if it exists and use it to solve systems of linear equations."
              }
            ]
          }
        ]
      },
      {
        "key": "F",
        "desc": "Functions",
        "clusters": [
          {
            "key": "IF",
            "desc": "Interpreting Functions",
            "standards": [
              {
                "key": "1",
                "desc": "Understand that a function assigns to each element of the domain exactly one element of the range."
              },
              {
                "key": "2",
                "desc": "Use function notation, evaluate functions for inputs in their domains, and interpret statements that use function notation in terms of a context."
              },
              {
                "key": "3",
                "desc": "Recognize that sequences are functions, sometimes defined recursively, whose domain is a subset of the integers."
              },
              {
                "key": "4",
                "desc": "For a function that models a relationship between two quantities, interpret key features of graphs and tables in terms of the quantities."
              },
              {
                "key": "5",
                "desc": "Relate the domain of a function to its graph and, where applicable, to the quantitative relationship it describes."
              },
              {
                "key": "6",
                "desc": "Calculate and interpret the average rate of change of a function over a specified interval."
              },
              {
                "key": "7",
                "desc": "Graph functions expressed symbolically and show key features of the graph."
              },
              {
                "key": "8",
                "desc": "Write a function defined by an expression in different but equivalent forms to reveal and explain different properties of the function."
              },
              {
                "key": "9",
                "desc": "Compare properties of two functions each represented in a different way."
              }
            ]
          },
          {
            "key": "BF",
            "desc": "Building Functions",
            "standards": [
              {
                "key": "1",
                "desc": "Write a function that describes a relationship between two quantities.",
                "subStandards": [
                  {
                    "key": "1a",
                    "desc": "Determine an explicit expression, a recursive process, or steps for calculation from a context."
                  },
                  {
                    "key": "1b",
                    "desc": "Combine standard function types using arithmetic operations."
                  },
                  {
                    "key": "1c",
                    "desc": "Compose functions."
                  }
                ]
              },
              {
                "key": "2",
                "desc": "Write arithmetic and geometric sequences both recursively and with an explicit formula."
              },
              {
                "key": "3",
                "desc": "Identify the effect on the graph of replacing f(x) by f(x) + k, kf(x), f(kx), and f(x + k)."
              },
              {
                "key": "4",
                "desc": "Find inverse functions.",
                "subStandards": [
                  {
                    "key": "4a",
                    "desc": "Solve an equation of the form f(x) = c for a simple function f that has an inverse and write an expression for the inverse."
                  },
                  {
                    "key": "4b",
                    "desc": "Verify by composition that one function is the inverse of another."
                  },
                  {
                    "key": "4c",
                    "desc": "Read values of an inverse function from a graph or a table, given that the function has an inverse."
                  },
                  {
                    "key": "4d",
                    "desc": "Produce an invertible function from a non-invertible function by restricting the domain."
                  }
                ]
              },
              {
                "key": "5",
                "desc": "Understand the inverse relationship between exponents and logarithms and use this relationship to solve problems involving logarithms and exponents."
              }
            ]
          },
          {
            "key": "LE",
            "desc": "Linear, Quadratic, and Exponential Models",
            "standards": [
              {
                "key": "1",
                "desc": "Distinguish between situations that can be modeled with linear functions and with exponential functions.",
                "subStandards": [
                  {
                    "key": "1a",
                    "desc": "Prove that linear functions grow by equal differences over equal intervals, and that exponential functions grow by equal factors over equal intervals."
                  },
                  {
                    "key": "1b",
                    "desc": "Recognize situations in which one quantity changes at a constant rate per unit interval relative to another."
                  },
                  {
                    "key": "1c",
                    "desc": "Recognize situations in which a quantity grows or decays by a constant percent rate per unit interval relative to another."
                  }
                ]
              },
              {
                "key": "2",
                "desc": "Construct linear and exponential functions, including arithmetic and geometric sequences, given a graph, a description of a relationship, or two input-output pairs."
              },
              {
                "key": "3",
                "desc": "Observe using graphs and tables that a quantity increasing exponentially eventually exceeds a quantity increasing linearly, quadratically, or as a polynomial function."
              },
              {
                "key": "4",
                "desc": "For exponential models, express as a logarithm the solution to ab^ct = d where a, c, and d are numbers and the base b is 2, 10, or e."
              },
              {
                "key": "5",
                "desc": "Interpret the parameters in a linear or exponential function in terms of a context."
              }
            ]
          },
          {
            "key": "TF",
            "desc": "Trigonometric Functions",
            "standards": [
              {
                "key": "1",
                "desc": "Understand radian measure of an angle as the length of the arc on the unit circle subtended by the angle."
              },
              {
                "key": "2",
                "desc": "Explain how the unit circle in the coordinate plane enables the extension of trigonometric functions to all real numbers."
              },
              {
                "key": "3",
                "desc": "Use special triangles to determine geometrically the values of sine, cosine, tangent for π/3, π/4, and π/6."
              },
              {
                "key": "4",
                "desc": "Use the unit circle to explain symmetry (odd and even) and periodicity of trigonometric functions."
              },
              {
                "key": "5",
                "desc": "Choose trigonometric functions to model periodic phenomena with specified amplitude, frequency, and midline."
              },
              {
                "key": "6",
                "desc": "Understand that restricting a trigonometric function to a domain on which it is always increasing or always decreasing allows its inverse to be constructed."
              },
              {
                "key": "7",
                "desc": "Use inverse functions to solve trigonometric equations that arise in modeling contexts; evaluate the solutions using technology."
              },
              {
                "key": "8",
                "desc": "Prove the Pythagorean identity sin²(θ) + cos²(θ) = 1 and use it to find sin(θ), cos(θ), or tan(θ)."
              },
              {
                "key": "9",
                "desc": "Prove the addition and subtraction formulas for sine, cosine, and tangent and use them to solve problems."
              }
            ]
          }
        ]
      },
      {
        "key": "G",
        "desc": "Geometry",
        "clusters": [
          {
            "key": "CO",
            "desc": "Congruence",
            "standards": [
              {
                "key": "1",
                "desc": "Know precise definitions of angle, circle, perpendicular line, parallel line, and line segment."
              },
              {
                "key": "2",
                "desc": "Represent transformations in the plane using, e.g., transparencies and geometry software."
              },
              {
                "key": "3",
                "desc": "Given a rectangle, parallelogram, trapezoid, or regular polygon, describe the rotations and reflections that carry it onto itself."
              },
              {
                "key": "4",
                "desc": "Develop definitions of rotations, reflections, and translations in terms of angles, circles, perpendicular lines, parallel lines, and line segments."
              },
              {
                "key": "5",
                "desc": "Given a geometric figure and a rotation, reflection, or translation, draw the transformed figure."
              },
              {
                "key": "6",
                "desc": "Use geometric descriptions of rigid motions to transform figures and to predict the effect of a given rigid motion on a given figure."
              },
              {
                "key": "7",
                "desc": "Use the definition of congruence in terms of rigid motions to show that two triangles are congruent."
              },
              {
                "key": "8",
                "desc": "Explain how the criteria for triangle congruence (ASA, SAS, and SSS) follow from the definition of congruence in terms of rigid motions."
              },
              {
                "key": "9",
                "desc": "Prove theorems about lines and angles."
              },
              {
                "key": "10",
                "desc": "Prove theorems about triangles."
              },
              {
                "key": "11",
                "desc": "Prove theorems about parallelograms."
              },
              {
                "key": "12",
                "desc": "Make formal geometric constructions with a variety of tools and methods."
              },
              {
                "key": "13",
                "desc": "Construct an equilateral triangle, a square, and a regular hexagon inscribed in a circle."
              }
            ]
          },
          {
            "key": "SRT",
            "desc": "Similarity, Right Triangles, and Trigonometry",
            "standards": [
              {
                "key": "1",
                "desc": "Verify experimentally the properties of dilations given by a center and a scale factor.",
                "subStandards": [
                  {
                    "key": "1a",
                    "desc": "A dilation takes a line not passing through the center of the dilation to a parallel line."
                  },
                  {
                    "key": "1b",
                    "desc": "The dilation of a line segment is longer or shorter in the ratio given by the scale factor."
                  }
                ]
              },
              {
                "key": "2",
                "desc": "Given two figures, use the definition of similarity in terms of similarity transformations to decide if they are similar."
              },
              {
                "key": "3",
                "desc": "Use the properties of similarity transformations to establish the AA criterion for two triangles to be similar."
              },
              {
                "key": "4",
                "desc": "Prove theorems about triangles."
              },
              {
                "key": "5",
                "desc": "Use congruence and similarity criteria for triangles to solve problems and to prove relationships in geometric figures."
              },
              {
                "key": "6",
                "desc": "Understand that by similarity, side ratios in right triangles are properties of the angles in the triangle."
              },
              {
                "key": "7",
                "desc": "Explain and use the relationship between the sine and cosine of complementary angles."
              },
              {
                "key": "8",
                "desc": "Use trigonometric ratios and the Pythagorean Theorem to solve right triangles in applied problems."
              },
              {
                "key": "9",
                "desc": "Derive the formula A = 1/2 ab sin(C) for the area of a triangle."
              },
              {
                "key": "10",
                "desc": "Prove the Laws of Sines and Cosines and use them to solve problems."
              },
              {
                "key": "11",
                "desc": "Understand and apply the Law of Sines and the Law of Cosines to find unknown measurements in right and non-right triangles."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Circles",
            "standards": [
              {
                "key": "1",
                "desc": "Prove that all circles are similar."
              },
              {
                "key": "2",
                "desc": "Identify and describe relationships among inscribed angles, radii, and chords."
              },
              {
                "key": "3",
                "desc": "Construct the inscribed and circumscribed circles of a triangle, and prove properties of angles for a quadrilateral inscribed in a circle."
              },
              {
                "key": "4",
                "desc": "Construct a tangent line from a point outside a given circle to the circle."
              },
              {
                "key": "5",
                "desc": "Derive using similarity the fact that the length of the arc intercepted by an angle is proportional to the radius."
              }
            ]
          },
          {
            "key": "GPE",
            "desc": "Expressing Geometric Properties with Equations",
            "standards": [
              {
                "key": "1",
                "desc": "Derive the equation of a circle of given center and radius using the Pythagorean Theorem."
              },
              {
                "key": "2",
                "desc": "Derive the equation of a parabola given a focus and directrix."
              },
              {
                "key": "3",
                "desc": "Derive the equations of ellipses and hyperbolas given the foci."
              },
              {
                "key": "4",
                "desc": "Use coordinates to prove simple geometric theorems algebraically."
              },
              {
                "key": "5",
                "desc": "Prove the slope criteria for parallel and perpendicular lines and use them to solve geometric problems."
              },
              {
                "key": "6",
                "desc": "Find the point on a directed line segment between two given points that partitions the segment in a given ratio."
              },
              {
                "key": "7",
                "desc": "Use coordinates to compute perimeters of polygons and areas of triangles and rectangles."
              }
            ]
          },
          {
            "key": "GMD",
            "desc": "Geometric Measurement and Dimension",
            "standards": [
              {
                "key": "1",
                "desc": "Give an informal argument for the formulas for the circumference of a circle, area of a circle, volume of a cylinder, pyramid, and cone."
              },
              {
                "key": "2",
                "desc": "Give an informal argument using Cavalieri’s principle for the formulas for the volume of a sphere and other solid figures."
              },
              {
                "key": "3",
                "desc": "Use volume formulas for cylinders, pyramids, cones, and spheres to solve problems."
              },
              {
                "key": "4",
                "desc": "Identify the shapes of two-dimensional cross-sections of three-dimensional objects."
              }
            ]
          },
          {
            "key": "MG",
            "desc": "Modeling with Geometry",
            "standards": [
              {
                "key": "1",
                "desc": "Use geometric shapes, their measures, and their properties to describe objects."
              },
              {
                "key": "2",
                "desc": "Apply concepts of density based on area and volume in modeling situations."
              },
              {
                "key": "3",
                "desc": "Apply geometric methods to solve design problems."
              }
            ]
          }
        ]
      },
      {
        "key": "S",
        "desc": "Statistics and Probability",
        "clusters": [
          {
            "key": "ID",
            "desc": "Interpreting Categorical and Quantitative Data",
            "standards": [
              {
                "key": "1",
                "desc": "Represent data with plots on the real number line (dot plots, histograms, and box plots)."
              },
              {
                "key": "2",
                "desc": "Use statistics appropriate to the shape of the data distribution to compare center and spread of two or more different data sets."
              },
              {
                "key": "3",
                "desc": "Interpret differences in shape, center, and spread in the context of the data sets."
              },
              {
                "key": "4",
                "desc": "Use the mean and standard deviation of a data set to fit it to a normal distribution and to estimate population percentages."
              },
              {
                "key": "5",
                "desc": "Summarize categorical data for two categories in two-way frequency tables."
              },
              {
                "key": "6",
                "desc": "Represent data on two quantitative variables on a scatter plot, and describe how the variables are related.",
                "subStandards": [
                  {
                    "key": "6a",
                    "desc": "Fit a function to the data."
                  },
                  {
                    "key": "6b",
                    "desc": "Informally assess the fit of a function by plotting and analyzing residuals."
                  },
                  {
                    "key": "6c",
                    "desc": "Fit a linear function for a scatter plot that suggests a linear association."
                  }
                ]
              },
              {
                "key": "7",
                "desc": "Interpret the slope and the intercept of a linear model in the context of the data."
              },
              {
                "key": "8",
                "desc": "Compute and interpret the correlation coefficient of a linear fit."
              },
              {
                "key": "9",
                "desc": "Distinguish between correlation and causation."
              }
            ]
          },
          {
            "key": "IC",
            "desc": "Making Inferences and Justifying Conclusions",
            "standards": [
              {
                "key": "1",
                "desc": "Understand statistics as a process for making inferences about population parameters based on a random sample from that population."
              },
              {
                "key": "2",
                "desc": "Decide if a specified model is consistent with results from a given data-generating process."
              },
              {
                "key": "3",
                "desc": "Recognize the purposes of and differences among sample surveys, experiments, and observational studies."
              },
              {
                "key": "4",
                "desc": "Use data from a sample survey to estimate a population mean or proportion."
              },
              {
                "key": "5",
                "desc": "Use data from a randomized experiment to compare two treatments."
              },
              {
                "key": "6",
                "desc": "Evaluate reports based on data."
              }
            ]
          },
          {
            "key": "CP",
            "desc": "Conditional Probability and the Rules of Probability",
            "standards": [
              {
                "key": "1",
                "desc": "Describe events as subsets of a sample space using characteristics of the outcomes."
              },
              {
                "key": "2",
                "desc": "Understand that two events A and B are independent if the probability of A and B occurring together is the product of their probabilities."
              },
              {
                "key": "3",
                "desc": "Understand the conditional probability of A given B as P(A and B)/P(B)."
              },
              {
                "key": "4",
                "desc": "Construct and interpret two-way frequency tables of data."
              },
              {
                "key": "5",
                "desc": "Recognize and explain the concepts of conditional probability and independence in everyday language and everyday situations."
              },
              {
                "key": "6",
                "desc": "Find the conditional probability of A given B as the fraction of B's outcomes that also belong to A."
              },
              {
                "key": "7",
                "desc": "Apply the Addition Rule, P(A or B) = P(A) + P(B) – P(A and B)."
              },
              {
                "key": "8",
                "desc": "Apply the general Multiplication Rule in a uniform probability model."
              },
              {
                "key": "9",
                "desc": "Use permutations and combinations to compute probabilities of compound events and solve problems."
              }
            ]
          },
          {
            "key": "MD",
            "desc": "Using Probability to Make Decisions",
            "standards": [
              {
                "key": "1",
                "desc": "Define a random variable for a quantity of interest by assigning a numerical value to each event in a sample space."
              },
              {
                "key": "2",
                "desc": "Calculate the expected value of a random variable; interpret it as the mean of the probability distribution."
              },
              {
                "key": "3",
                "desc": "Develop a probability distribution for a random variable defined for a sample space in which theoretical probabilities can be calculated."
              },
              {
                "key": "4",
                "desc": "Develop a probability distribution for a random variable defined for a sample space in which probabilities are assigned empirically."
              },
              {
                "key": "5",
                "desc": "Weigh the possible outcomes of a decision by assigning probabilities to payoff values and finding expected values."
              },
              {
                "key": "6",
                "desc": "Use probabilities to make fair decisions."
              },
              {
                "key": "7",
                "desc": "Analyze decisions and strategies using probability concepts."
              }
            ]
          }
        ]
      }
    ]
  },  
  {
    "key": "8",
    "desc": "8th",
    "domains": [
      {
        "key": "NS",
        "desc": "The Number System",
        "clusters": [
          {
            "key": "A",
            "desc": "Know that there are numbers that are not rational, and approximate them by rational numbers.",
            "standards": [
              {
                "key": "1",
                "desc": "Know that numbers that are not rational are called irrational. Understand informally that every number has a decimal expansion; for rational numbers, show that the decimal expansion repeats eventually, and convert a decimal expansion which repeats eventually into a rational number."
              },
              {
                "key": "2",
                "desc": "Use rational approximations of irrational numbers to compare the size of irrational numbers, locate them approximately on a number line diagram, and estimate the value of expressions (e.g., π²). For example, by truncating the decimal expansion of √2, show that √2 is between 1 and 2, then between 1.4 and 1.5, and explain how to continue on to get better approximations."
              }
            ]
          }
        ]
      },
      {
        "key": "EE",
        "desc": "Expressions and Equations",
        "clusters": [
          {
            "key": "A",
            "desc": "Work with radicals and integer exponents.",
            "standards": [
              {
                "key": "1",
                "desc": "Know and apply the properties of integer exponents to generate equivalent numerical expressions. For example, 3² × 3⁻⁵ = 3⁻³ = 1/3³ = 1/27."
              },
              {
                "key": "2",
                "desc": "Use square root and cube root symbols to represent solutions to equations of the form x² = p and x³ = p, where p is a positive rational number. Evaluate square roots of small perfect squares and cube roots of small perfect cubes. Know that √2 is irrational."
              },
              {
                "key": "3",
                "desc": "Use numbers expressed in the form of a single digit times an integer power of 10 to estimate very large or very small quantities and to express how many times as much one is than the other. For example, estimate the population of the United States as 3 × 10⁸ and the population of the world as 7 × 10⁹, and determine that the world population is more than 20 times larger."
              },
              {
                "key": "4",
                "desc": "Perform operations with numbers expressed in scientific notation, including problems where both decimal and scientific notation are used. Use scientific notation and choose units of appropriate size for measurements of very large or very small quantities. Interpret scientific notation that has been generated by technology."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Understand the connections between proportional relationships, lines, and linear equations.",
            "standards": [
              {
                "key": "5",
                "desc": "Graph proportional relationships, interpreting the unit rate as the slope of the graph. Compare two different proportional relationships represented in different ways. For example, compare a distance-time graph to a distance-time equation to determine which of two moving objects has greater speed."
              },
              {
                "key": "6",
                "desc": "Use similar triangles to explain why the slope m is the same between any two distinct points on a non-vertical line in the coordinate plane; derive the equation y = mx for a line through the origin and the equation y = mx + b for a line intercepting the vertical axis at b."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Analyze and solve linear equations and pairs of simultaneous linear equations.",
            "standards": [
              {
                "key": "7",
                "desc": "Solve linear equations in one variable.",
                "subStandards": [
                  {
                    "key": "7a",
                    "desc": "Give examples of linear equations in one variable with one solution, infinitely many solutions, or no solutions. Show which of these possibilities is the case by successively transforming the given equation into simpler forms until an equivalent equation of the form x = a, a = a, or a = b results (where a and b are different numbers)."
                  },
                  {
                    "key": "7b",
                    "desc": "Solve linear equations with rational number coefficients, including equations whose solutions require expanding expressions using the distributive property and collecting like terms."
                  }
                ]
              },
              {
                "key": "8",
                "desc": "Analyze and solve pairs of simultaneous linear equations.",
                "subStandards": [
                  {
                    "key": "8a",
                    "desc": "Understand that solutions to a system of two linear equations in two variables correspond to points of intersection of their graphs because points of intersection satisfy both equations simultaneously."
                  },
                  {
                    "key": "8b",
                    "desc": "Solve systems of two linear equations in two variables algebraically and estimate solutions by graphing the equations. Solve simple cases by inspection."
                  },
                  {
                    "key": "8c",
                    "desc": "Solve real-world and mathematical problems leading to two linear equations in two variables. For example, given coordinates for two pairs of points, determine whether the line through the first pair of points intersects the line through the second pair."
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "key": "F",
        "desc": "Functions",
        "clusters": [
          {
            "key": "A",
            "desc": "Define, evaluate, and compare functions.",
            "standards": [
              {
                "key": "1",
                "desc": "Understand that a function is a rule that assigns to each input exactly one output. The graph of a function is the set of ordered pairs consisting of an input and the corresponding output."
              },
              {
                "key": "2",
                "desc": "Compare properties of two functions each represented in a different way (algebraically, graphically, numerically in tables, or by verbal descriptions). For example, given a linear function represented by a table of values and a linear function represented by an algebraic expression, determine which function has the greater rate of change."
              },
              {
                "key": "3",
                "desc": "Interpret the equation y = mx + b as defining a linear function, whose graph is a straight line; give examples of functions that are not linear."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Use functions to model relationships between quantities.",
            "standards": [
              {
                "key": "4",
                "desc": "Construct a function to model a linear relationship between two quantities. Determine the rate of change and initial value of the function from a description of a relationship or from two (x, y) values, including reading these from a table or from a graph. Interpret the rate of change and initial value of a linear function in terms of the situation it models and in terms of its graph or a table of values."
              },
              {
                "key": "5",
                "desc": "Describe qualitatively the functional relationship between two quantities by analyzing a graph. Sketch a graph that exhibits the qualitative features of a function that has been described verbally."
              }
            ]
          }
        ]
      },
      {
        "key": "G",
        "desc": "Geometry",
        "clusters": [
          {
            "key": "A",
            "desc": "Understand congruence and similarity using physical models, transparencies, or geometry software.",
            "standards": [
              {
                "key": "1",
                "desc": "Verify experimentally the properties of rotations, reflections, and translations:",
                "subStandards": [
                  {
                    "key": "1a",
                    "desc": "Lines are taken to lines, and line segments to line segments of the same length."
                  },
                  {
                    "key": "1b",
                    "desc": "Angles are taken to angles of the same measure."
                  },
                  {
                    "key": "1c",
                    "desc": "Parallel lines are taken to parallel lines."
                  }
                ]
              },
              {
                "key": "2",
                "desc": "Understand that a two-dimensional figure is congruent to another if the second can be obtained from the first by a sequence of rotations, reflections, and translations; given two congruent figures, describe a sequence that exhibits the congruence between them."
              },
              {
                "key": "3",
                "desc": "Describe the effect of dilations, translations, rotations, and reflections on two-dimensional figures using coordinates."
              },
              {
                "key": "4",
                "desc": "Understand that a two-dimensional figure is similar to another if the second can be obtained from the first by a sequence of rotations, reflections, translations, and dilations; given two similar two-dimensional figures, describe a sequence that exhibits the similarity between them."
              },
              {
                "key": "5",
                "desc": "Use informal arguments to establish facts about the angle sum and exterior angle of triangles, about the angles created when parallel lines are cut by a transversal, and the angle–angle criterion for similarity of triangles."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Understand and apply the Pythagorean Theorem.",
            "standards": [
              {
                "key": "6",
                "desc": "Explain a proof of the Pythagorean Theorem and its converse."
              },
              {
                "key": "7",
                "desc": "Apply the Pythagorean Theorem to determine unknown side lengths in right triangles in real-world and mathematical problems in two and three dimensions."
              },
              {
                "key": "8",
                "desc": "Apply the Pythagorean Theorem to find the distance between two points in a coordinate system."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Solve real-world and mathematical problems involving volume of cylinders, cones, and spheres.",
            "standards": [
              {
                "key": "9",
                "desc": "Know the formulas for the volumes of cones, cylinders, and spheres and use them to solve real-world and mathematical problems."
              }
            ]
          }
        ]
      },
      {
        "key": "SP",
        "desc": "Statistics and Probability",
        "clusters": [
          {
            "key": "A",
            "desc": "Investigate patterns of association in bivariate data.",
            "standards": [
              {
                "key": "1",
                "desc": "Construct and interpret scatter plots for bivariate measurement data to investigate patterns of association between two quantities. Describe patterns such as clustering, outliers, positive or negative association, linear association, and nonlinear association."
              },
              {
                "key": "2",
                "desc": "Know that straight lines are widely used to model relationships between two quantitative variables. For scatter plots that suggest a linear association, informally fit a straight line and informally assess the model fit by judging the closeness of the data points to the line."
              },
              {
                "key": "3",
                "desc": "Use the equation of a linear model to solve problems in the context of bivariate measurement data, interpreting the slope and intercept. For example, in a linear model for a biology experiment, interpret a slope of 1.5 cm/hr as meaning that an additional hour of sunlight each day is associated with an additional 1.5 cm in mature plant height."
              },
              {
                "key": "4",
                "desc": "Understand that patterns of association can also be seen in bivariate categorical data by displaying frequencies and relative frequencies in a two-way table. Construct and interpret a two-way table summarizing data on two categorical variables collected from the same subjects. Use relative frequencies calculated for rows or columns to describe possible association between the two variables."
              }
            ]
          }
        ]
      }
    ]
  },  
  {
    "key": "7",
    "desc": "7th",
    "domains": [
      {
        "key": "RP",
        "desc": "Ratios and Proportional Relationships",
        "clusters": [
          {
            "key": "A",
            "desc": "Analyze proportional relationships and use them to solve real-world and mathematical problems.",
            "standards": [
              {
                "key": "1",
                "desc": "Compute unit rates associated with ratios of fractions, including ratios of lengths, areas, and other quantities measured in like or different units. For example, if a person walks 1⁄2 mile in each 1⁄4 hour, compute the unit rate as the complex fraction (1⁄2)/(1⁄4) miles per hour, equivalently 2 miles per hour."
              },
              {
                "key": "2",
                "desc": "Recognize and represent proportional relationships between quantities.",
                "subStandards": [
                  {
                    "key": "2a",
                    "desc": "Decide whether two quantities are in a proportional relationship, e.g., by testing for equivalent ratios in a table or graphing on a coordinate plane and observing whether the graph is a straight line through the origin."
                  },
                  {
                    "key": "2b",
                    "desc": "Identify the constant of proportionality (unit rate) in tables, graphs, equations, diagrams, and verbal descriptions of proportional relationships."
                  },
                  {
                    "key": "2c",
                    "desc": "Represent proportional relationships by equations. For example, if total cost t is proportional to the number n of items purchased at a constant price p, the relationship between the total cost and the number of items can be expressed as t = pn."
                  },
                  {
                    "key": "2d",
                    "desc": "Explain what a point (x, y) on the graph of a proportional relationship means in terms of the situation, with special attention to the points (0, 0) and (1, r) where r is the unit rate."
                  }
                ]
              },
              {
                "key": "3",
                "desc": "Use proportional relationships to solve multistep ratio and percent problems. Examples include simple interest, tax, markups and markdowns, gratuities and commissions, fees, percent increase and decrease, and percent error."
              }
            ]
          }
        ]
      },
      {
        "key": "NS",
        "desc": "The Number System",
        "clusters": [
          {
            "key": "A",
            "desc": "Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.",
            "standards": [
              {
                "key": "1",
                "desc": "Apply and extend previous understandings of addition and subtraction to add and subtract rational numbers; represent addition and subtraction on a horizontal or vertical number line diagram.",
                "subStandards": [
                  {
                    "key": "1a",
                    "desc": "Describe situations in which opposite quantities combine to make 0. For example, a hydrogen atom has 0 charge because its two constituents are oppositely charged."
                  },
                  {
                    "key": "1b",
                    "desc": "Understand p + q as the number located a distance |q| from p, in the positive or negative direction depending on whether q is positive or negative. Show that a number and its opposite have a sum of 0 (are additive inverses). Interpret sums of rational numbers by describing real-world contexts."
                  },
                  {
                    "key": "1c",
                    "desc": "Understand subtraction of rational numbers as adding the additive inverse, p – q = p + (–q). Show that the distance between two rational numbers on the number line is the absolute value of their difference, and apply this principle in real-world contexts."
                  },
                  {
                    "key": "1d",
                    "desc": "Apply properties of operations as strategies to add and subtract rational numbers."
                  }
                ]
              },
              {
                "key": "2",
                "desc": "Apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers.",
                "subStandards": [
                  {
                    "key": "2a",
                    "desc": "Understand that multiplication is extended from fractions to rational numbers by requiring that operations continue to satisfy the properties of operations, leading to products such as (–1)(–1) = 1 and the rules for multiplying signed numbers. Interpret products of rational numbers by describing real-world contexts."
                  },
                  {
                    "key": "2b",
                    "desc": "Understand that integers can be divided, provided that the divisor is not zero, and every quotient of integers (with nonzero divisor) is a rational number. If p and q are integers, then –(p/q) = (–p)/q = p/(–q). Interpret quotients of rational numbers by describing real-world contexts."
                  },
                  {
                    "key": "2c",
                    "desc": "Apply properties of operations as strategies to multiply and divide rational numbers."
                  },
                  {
                    "key": "2d",
                    "desc": "Convert a rational number to a decimal using long division; know that the decimal form of a rational number terminates in 0s or eventually repeats."
                  }
                ]
              },
              {
                "key": "3",
                "desc": "Solve real-world and mathematical problems involving the four operations with rational numbers."
              }
            ]
          }
        ]
      },
      {
        "key": "EE",
        "desc": "Expressions and Equations",
        "clusters": [
          {
            "key": "A",
            "desc": "Use properties of operations to generate equivalent expressions.",
            "standards": [
              {
                "key": "1",
                "desc": "Apply properties of operations as strategies to add, subtract, factor, and expand linear expressions with rational coefficients."
              },
              {
                "key": "2",
                "desc": "Understand that rewriting an expression in different forms in a problem context can shed light on the problem and how the quantities in it are related. For example, a + 0.05a = 1.05a means that “increase by 5%” is the same as “multiply by 1.05.”"
              }
            ]
          },
          {
            "key": "B",
            "desc": "Solve real-life and mathematical problems using numerical and algebraic expressions and equations.",
            "standards": [
              {
                "key": "3",
                "desc": "Solve multi-step real-life and mathematical problems posed with positive and negative rational numbers in any form (whole numbers, fractions, and decimals), using tools strategically. Apply properties of operations to calculate with numbers in any form; convert between forms as appropriate; and assess the reasonableness of answers using mental computation and estimation strategies."
              },
              {
                "key": "4",
                "desc": "Use variables to represent quantities in a real-world or mathematical problem, and construct simple equations and inequalities to solve problems by reasoning about the quantities.",
                "subStandards": [
                  {
                    "key": "4a",
                    "desc": "Solve word problems leading to equations of the form px + q = r and p(x + q) = r, where p, q, and r are specific rational numbers. Solve equations of these forms fluently. Compare an algebraic solution to an arithmetic solution, identifying the sequence of the operations used in each approach."
                  },
                  {
                    "key": "4b",
                    "desc": "Solve word problems leading to inequalities of the form px + q > r or px + q < r, where p, q, and r are specific rational numbers. Graph the solution set of the inequality and interpret it in the context of the problem."
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "key": "G",
        "desc": "Geometry",
        "clusters": [
          {
            "key": "A",
            "desc": "Draw, construct, and describe geometrical figures and describe the relationships between them.",
            "standards": [
              {
                "key": "1",
                "desc": "Solve problems involving scale drawings of geometric figures, including computing actual lengths and areas from a scale drawing and reproducing a scale drawing at a different scale."
              },
              {
                "key": "2",
                "desc": "Draw (freehand, with ruler and protractor, and with technology) geometric shapes with given conditions. Focus on constructing triangles from three measures of angles or sides, noticing when the conditions determine a unique triangle, more than one triangle, or no triangle."
              },
              {
                "key": "3",
                "desc": "Describe the two-dimensional figures that result from slicing three-dimensional figures, as in plane sections of right rectangular prisms and right rectangular pyramids."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Solve real-life and mathematical problems involving angle measure, area, surface area, and volume.",
            "standards": [
              {
                "key": "4",
                "desc": "Know the formulas for the area and circumference of a circle and use them to solve problems; give an informal derivation of the relationship between the circumference and area of a circle."
              },
              {
                "key": "5",
                "desc": "Use facts about supplementary, complementary, vertical, and adjacent angles in a multi-step problem to write and solve simple equations for an unknown angle in a figure."
              },
              {
                "key": "6",
                "desc": "Solve real-world and mathematical problems involving area, volume, and surface area of two- and three-dimensional objects composed of triangles, quadrilaterals, polygons, cubes, and right prisms."
              }
            ]
          }
        ]
      },
      {
        "key": "SP",
        "desc": "Statistics and Probability",
        "clusters": [
          {
            "key": "A",
            "desc": "Use random sampling to draw inferences about a population.",
            "standards": [
              {
                "key": "1",
                "desc": "Understand that statistics can be used to gain information about a population by examining a sample of the population; generalizations about a population from a sample are valid only if the sample is representative of that population. Understand that random sampling tends to produce representative samples and support valid inferences."
              },
              {
                "key": "2",
                "desc": "Use data from a random sample to draw inferences about a population with an unknown characteristic of interest. Generate multiple samples of the same size to gauge the variation in estimates or predictions."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Draw informal comparative inferences about two populations.",
            "standards": [
              {
                "key": "3",
                "desc": "Informally assess the degree of visual overlap of two numerical data distributions with similar variabilities, measuring the difference between the centers by expressing it as a multiple of a measure of variability."
              },
              {
                "key": "4",
                "desc": "Use measures of center and measures of variability for numerical data from random samples to draw informal comparative inferences about two populations."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Investigate chance processes and develop, use, and evaluate probability models.",
            "standards": [
              {
                "key": "5",
                "desc": "Understand that the probability of a chance event is a number between 0 and 1 that expresses the likelihood of the event occurring."
              },
              {
                "key": "6",
                "desc": "Approximate the probability of a chance event by collecting data on the chance process that produces it and observing its long-run relative frequency."
              },
              {
                "key": "7",
                "desc": "Develop a probability model and use it to find probabilities of events. Compare probabilities from a model to observed frequencies; if the agreement is not good, explain possible sources of the discrepancy.",
                "subStandards": [
                  {
                    "key": "7a",
                    "desc": "Develop a uniform probability model by assigning equal probability to all outcomes, and use the model to determine probabilities of events."
                  },
                  {
                    "key": "7b",
                    "desc": "Develop a probability model (which may not be uniform) by observing frequencies in data generated from a chance process."
                  }
                ]
              },
              {
                "key": "8",
                "desc": "Find probabilities of compound events using organized lists, tables, tree diagrams, and simulation.",
                "subStandards": [
                  {
                    "key": "8a",
                    "desc": "Understand that, just as with simple events, the probability of a compound event is the fraction of outcomes in the sample space for which the compound event occurs."
                  },
                  {
                    "key": "8b",
                    "desc": "Represent sample spaces for compound events using methods such as organized lists, tables, and tree diagrams."
                  },
                  {
                    "key": "8c",
                    "desc": "Design and use a simulation to generate frequencies for compound events."
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },  
  {
    "key": "6",
    "desc": "6th",
    "domains": [
      {
        "key": "RP",
        "desc": "Ratios and Proportional Relationships",
        "clusters": [
          {
            "key": "A",
            "desc": "Understand ratio concepts and use ratio reasoning to solve problems.",
            "standards": [
              {
                "key": "1",
                "desc": "Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities. For example, \"The ratio of wings to beaks in the bird house at the zoo was 2:1, because for every 2 wings there was 1 beak.\" \"For every vote candidate A received, candidate C received nearly three votes.\""
              },
              {
                "key": "2",
                "desc": "Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship. For example, \"This recipe has a ratio of 3 cups of flour to 4 cups of sugar, so there is 3⁄4 cup of flour for each cup of sugar.\" \"We paid $75 for 15 hamburgers, which is a rate of $5 per hamburger.\""
              },
              {
                "key": "3",
                "desc": "Use ratio and rate reasoning to solve real-world and mathematical problems.",
                "subStandards": [
                  {
                    "key": "3a",
                    "desc": "Make tables of equivalent ratios relating quantities with whole-number measurements, find missing values in the tables, and plot the pairs of values on the coordinate plane. Use tables to compare ratios."
                  },
                  {
                    "key": "3b",
                    "desc": "Solve unit rate problems including those involving unit pricing and constant speed."
                  },
                  {
                    "key": "3c",
                    "desc": "Find a percent of a quantity as a rate per 100; solve problems involving finding the whole, given a part and the percent."
                  },
                  {
                    "key": "3d",
                    "desc": "Use ratio reasoning to convert measurement units; manipulate and transform units appropriately when multiplying or dividing quantities."
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "key": "NS",
        "desc": "The Number System",
        "clusters": [
          {
            "key": "A",
            "desc": "Apply and extend previous understandings of multiplication and division to divide fractions by fractions.",
            "standards": [
              {
                "key": "1",
                "desc": "Interpret and compute quotients of fractions, and solve word problems involving division of fractions by fractions."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Compute fluently with multi-digit numbers and find common factors and multiples.",
            "standards": [
              {
                "key": "2",
                "desc": "Fluently divide multi-digit numbers using the standard algorithm."
              },
              {
                "key": "3",
                "desc": "Fluently add, subtract, multiply, and divide multi-digit decimals using the standard algorithm for each operation."
              },
              {
                "key": "4",
                "desc": "Find the greatest common factor of two whole numbers less than or equal to 100 and the least common multiple of two whole numbers less than or equal to 12. Use the distributive property to express a sum of two whole numbers with a common factor as a multiple of a sum of two whole numbers with no common factor."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Apply and extend previous understandings of numbers to the system of rational numbers.",
            "standards": [
              {
                "key": "5",
                "desc": "Understand that positive and negative numbers are used together to describe quantities having opposite directions or values; use positive and negative numbers to represent quantities in real-world contexts, explaining the meaning of 0 in each situation."
              },
              {
                "key": "6",
                "desc": "Understand a rational number as a point on the number line.",
                "subStandards": [
                  {
                    "key": "6a",
                    "desc": "Recognize opposite signs of numbers as indicating locations on opposite sides of 0 on the number line; recognize that the opposite of the opposite of a number is the number itself."
                  },
                  {
                    "key": "6b",
                    "desc": "Understand signs of numbers in ordered pairs as indicating locations in quadrants of the coordinate plane."
                  },
                  {
                    "key": "6c",
                    "desc": "Find and position integers and other rational numbers on a horizontal or vertical number line diagram; find and position pairs of integers and other rational numbers on a coordinate plane."
                  }
                ]
              },
              {
                "key": "7",
                "desc": "Understand ordering and absolute value of rational numbers.",
                "subStandards": [
                  {
                    "key": "7a",
                    "desc": "Interpret statements of inequality as statements about the relative position of two numbers on a number line diagram."
                  },
                  {
                    "key": "7b",
                    "desc": "Write, interpret, and explain statements of order for rational numbers in real-world contexts."
                  },
                  {
                    "key": "7c",
                    "desc": "Understand the absolute value of a rational number as its distance from 0 on the number line."
                  },
                  {
                    "key": "7d",
                    "desc": "Distinguish comparisons of absolute value from statements about order."
                  }
                ]
              },
              {
                "key": "8",
                "desc": "Solve real-world and mathematical problems by graphing points in all four quadrants of the coordinate plane."
              }
            ]
          }
        ]
      },
      {
        "key": "EE",
        "desc": "Expressions and Equations",
        "clusters": [
          {
            "key": "A",
            "desc": "Apply and extend previous understandings of arithmetic to algebraic expressions.",
            "standards": [
              {
                "key": "1",
                "desc": "Write and evaluate numerical expressions involving whole-number exponents."
              },
              {
                "key": "2",
                "desc": "Write, read, and evaluate expressions in which letters stand for numbers.",
                "subStandards": [
                  {
                    "key": "2a",
                    "desc": "Write expressions that record operations with numbers and with letters standing for numbers."
                  },
                  {
                    "key": "2b",
                    "desc": "Identify parts of an expression using mathematical terms; view one or more parts of an expression as a single entity."
                  },
                  {
                    "key": "2c",
                    "desc": "Evaluate expressions at specific values of their variables, including expressions that arise from formulas used in real-world problems."
                  }
                ]
              },
              {
                "key": "3",
                "desc": "Apply the properties of operations to generate equivalent expressions."
              },
              {
                "key": "4",
                "desc": "Identify when two expressions are equivalent."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Reason about and solve one-variable equations and inequalities.",
            "standards": [
              {
                "key": "5",
                "desc": "Understand solving an equation or inequality as a process of answering a question: which values from a specified set make the equation or inequality true?"
              },
              {
                "key": "6",
                "desc": "Use variables to represent numbers and write expressions when solving a real-world or mathematical problem."
              },
              {
                "key": "7",
                "desc": "Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q."
              },
              {
                "key": "8",
                "desc": "Write an inequality of the form x > c or x < c to represent a constraint or condition in a real-world or mathematical problem."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Represent and analyze quantitative relationships between dependent and independent variables.",
            "standards": [
              {
                "key": "9",
                "desc": "Use variables to represent two quantities in a real-world problem that change in relationship to one another; write an equation to express one quantity in terms of the other quantity."
              }
            ]
          }
        ]
      },
      {
        "key": "G",
        "desc": "Geometry",
        "clusters": [
          {
            "key": "A",
            "desc": "Solve real-world and mathematical problems involving area, surface area, and volume.",
            "standards": [
              {
                "key": "1",
                "desc": "Find the area of right triangles, other triangles, special quadrilaterals, and polygons by composing into rectangles or decomposing into triangles and other shapes."
              },
              {
                "key": "2",
                "desc": "Find the volume of a right rectangular prism with fractional edge lengths by packing it with unit cubes of the appropriate unit fraction edge lengths."
              },
              {
                "key": "3",
                "desc": "Draw polygons in the coordinate plane given coordinates for the vertices; use coordinates to find the length of a side."
              },
              {
                "key": "4",
                "desc": "Represent three-dimensional figures using nets made up of rectangles and triangles, and use the nets to find the surface area of these figures."
              }
            ]
          }
        ]
      },
      {
        "key": "SP",
        "desc": "Statistics and Probability",
        "clusters": [
          {
            "key": "A",
            "desc": "Develop understanding of statistical variability.",
            "standards": [
              {
                "key": "1",
                "desc": "Recognize a statistical question as one that anticipates variability in the data related to the question and accounts for it in the answers."
              },
              {
                "key": "2",
                "desc": "Understand that a set of data collected to answer a statistical question has a distribution which can be described by its center, spread, and overall shape."
              },
              {
                "key": "3",
                "desc": "Recognize that a measure of center for a numerical data set summarizes all of its values with a single number, while a measure of variation describes how its values vary with a single number."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Summarize and describe distributions.",
            "standards": [
              {
                "key": "4",
                "desc": "Display numerical data in plots on a number line, including dot plots, histograms, and box plots."
              },
              {
                "key": "5",
                "desc": "Summarize numerical data sets in relation to their context, such as by:",
                "subStandards": [
                  {
                    "key": "5a",
                    "desc": "Reporting the number of observations."
                  },
                  {
                    "key": "5b",
                    "desc": "Describing the nature of the attribute under investigation, including how it was measured and its units of measurement."
                  },
                  {
                    "key": "5c",
                    "desc": "Giving quantitative measures of center (median and/or mean) and variability (interquartile range and/or mean absolute deviation), and describing any overall pattern and any striking deviations from the overall pattern."
                  },
                  {
                    "key": "5d",
                    "desc": "Relating the choice of measures of center and variability to the shape of the data distribution and the context in which the data were gathered."
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },  
  {
    "key": "5",
    "desc": "5th",
    "domains": [
      {
        "key": "OA",
        "desc": "Operations and Algebraic Thinking",
        "clusters": [
          {
            "key": "A",
            "desc": "Write and interpret numerical expressions.",
            "standards": [
              {
                "key": "1",
                "desc": "Use parentheses, brackets, or braces in numerical expressions, and evaluate expressions with these symbols."
              },
              {
                "key": "2",
                "desc": "Write simple expressions that record calculations with numbers, and interpret numerical expressions without evaluating them. For example, express the calculation \"add 8 and 7, then multiply by 2\" as 2 × (8 + 7). Recognize that 3 × (18,932 + 921) is three times as large as 18,932 + 921, without having to calculate the indicated sum or product."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Analyze patterns and relationships.",
            "standards": [
              {
                "key": "3",
                "desc": "Generate two numerical patterns using two given rules. Identify apparent relationships between corresponding terms. Form ordered pairs consisting of corresponding terms from the two patterns, and graph the ordered pairs on a coordinate plane. For example, given the rule \"Add 3\" and the starting number 0, and given the rule \"Add 6\" and the starting number 0, generate terms in the resulting sequences, and observe that the terms in one sequence are twice the corresponding terms in the other sequence. Explain informally why this is so."
              }
            ]
          }
        ]
      },
      {
        "key": "NBT",
        "desc": "Number and Operations in Base Ten",
        "clusters": [
          {
            "key": "A",
            "desc": "Understand the place value system.",
            "standards": [
              {
                "key": "1",
                "desc": "Recognize that in a multi-digit number, a digit in one place represents 10 times as much as it represents in the place to its right and 1⁄10 of what it represents in the place to its left."
              },
              {
                "key": "2",
                "desc": "Explain patterns in the number of zeros of the product when multiplying a number by powers of 10, and explain patterns in the placement of the decimal point when a decimal is multiplied or divided by a power of 10. Use whole-number exponents to denote powers of 10."
              },
              {
                "key": "3",
                "desc": "Read, write, and compare decimals to thousandths.",
                "subStandards": [
                  {
                    "key": "3a",
                    "desc": "Read and write decimals to thousandths using base-ten numerals, number names, and expanded form, e.g., 347.392 = 3 × 100 + 4 × 10 + 7 × 1 + 3 × (1⁄10) + 9 × (1⁄100) + 2 × (1⁄1000)."
                  },
                  {
                    "key": "3b",
                    "desc": "Compare two decimals to thousandths based on meanings of the digits in each place, using >, =, and < symbols to record the results of comparisons."
                  }
                ]
              },
              {
                "key": "4",
                "desc": "Use place value understanding to round decimals to any place."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Perform operations with multi-digit whole numbers and with decimals to hundredths.",
            "standards": [
              {
                "key": "5",
                "desc": "Fluently multiply multi-digit whole numbers using the standard algorithm."
              },
              {
                "key": "6",
                "desc": "Find whole-number quotients of whole numbers with up to four-digit dividends and two-digit divisors, using strategies based on place value, the properties of operations, and/or the relationship between multiplication and division. Illustrate and explain the calculation by using equations, rectangular arrays, and/or area models."
              },
              {
                "key": "7",
                "desc": "Add, subtract, multiply, and divide decimals to hundredths, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used."
              }
            ]
          }
        ]
      },
      {
        "key": "NF",
        "desc": "Number and Operations—Fractions",
        "clusters": [
          {
            "key": "A",
            "desc": "Use equivalent fractions as a strategy to add and subtract fractions.",
            "standards": [
              {
                "key": "1",
                "desc": "Add and subtract fractions with unlike denominators (including mixed numbers) by replacing given fractions with equivalent fractions in such a way as to produce an equivalent sum or difference of fractions with like denominators."
              },
              {
                "key": "2",
                "desc": "Solve word problems involving addition and subtraction of fractions referring to the same whole, including cases of unlike denominators, e.g., by using visual fraction models or equations to represent the problem."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Apply and extend previous understandings of multiplication and division to multiply and divide fractions.",
            "standards": [
              {
                "key": "3",
                "desc": "Interpret a fraction as division of the numerator by the denominator (a⁄b = a ÷ b). Solve word problems involving division of whole numbers leading to answers in the form of fractions or mixed numbers."
              },
              {
                "key": "4",
                "desc": "Apply and extend previous understandings of multiplication to multiply a fraction or whole number by a fraction.",
                "subStandards": [
                  {
                    "key": "4a",
                    "desc": "Interpret the product (a⁄b) × q as a parts of a partition of q into b equal parts; equivalently, as the result of a sequence of operations a × q ÷ b."
                  },
                  {
                    "key": "4b",
                    "desc": "Find the area of a rectangle with fractional side lengths by tiling it with unit squares of the appropriate unit fraction side lengths."
                  }
                ]
              },
              {
                "key": "5",
                "desc": "Interpret multiplication as scaling (resizing).",
                "subStandards": [
                  {
                    "key": "5a",
                    "desc": "Compare the size of a product to the size of one factor on the basis of the size of the other factor, without performing the indicated multiplication."
                  },
                  {
                    "key": "5b",
                    "desc": "Explain why multiplying a given number by a fraction greater than 1 results in a product greater than the given number; explain why multiplying a given number by a fraction less than 1 results in a product smaller than the given number."
                  }
                ]
              },
              {
                "key": "6",
                "desc": "Solve real-world problems involving multiplication of fractions and mixed numbers, e.g., by using visual fraction models or equations to represent the problem."
              },
              {
                "key": "7",
                "desc": "Apply and extend previous understandings of division to divide unit fractions by whole numbers and whole numbers by unit fractions.",
                "subStandards": [
                  {
                    "key": "7a",
                    "desc": "Interpret division of a unit fraction by a non-zero whole number, and compute such quotients."
                  },
                  {
                    "key": "7b",
                    "desc": "Interpret division of a whole number by a unit fraction, and compute such quotients."
                  },
                  {
                    "key": "7c",
                    "desc": "Solve real-world problems involving division of unit fractions by non-zero whole numbers and division of whole numbers by unit fractions."
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "key": "MD",
        "desc": "Measurement and Data",
        "clusters": [
          {
            "key": "A",
            "desc": "Convert like measurement units within a given measurement system.",
            "standards": [
              {
                "key": "1",
                "desc": "Convert among different-sized standard measurement units within a given measurement system, and use these conversions in solving multi-step, real-world problems."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Represent and interpret data.",
            "standards": [
              {
                "key": "2",
                "desc": "Make a line plot to display a data set of measurements in fractions of a unit (1⁄2, 1⁄4, 1⁄8). Use operations on fractions for this grade to solve problems involving information presented in line plots."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition.",
            "standards": [
              {
                "key": "3",
                "desc": "Recognize volume as an attribute of solid figures and understand concepts of volume measurement.",
                "subStandards": [
                  {
                    "key": "3a",
                    "desc": "A cube with side length 1 unit is said to have \"one cubic unit\" of volume, and can be used to measure volume."
                  },
                  {
                    "key": "3b",
                    "desc": "A solid figure which can be packed without gaps or overlaps using n unit cubes is said to have a volume of n cubic units."
                  }
                ]
              },
              {
                "key": "4",
                "desc": "Measure volumes by counting unit cubes, using cubic cm, cubic in, cubic ft, and improvised units."
              },
              {
                "key": "5",
                "desc": "Relate volume to the operations of multiplication and addition and solve real-world and mathematical problems involving volume.",
                "subStandards": [
                  {
                    "key": "5a",
                    "desc": "Find the volume of a right rectangular prism with whole-number side lengths by packing it with unit cubes, and show that the volume is the same as would be found by multiplying the edge lengths."
                  },
                  {
                    "key": "5b",
                    "desc": "Apply the formulas V = l × w × h and V = b × h for rectangular prisms to find volumes of right rectangular prisms with whole-number edge lengths."
                  },
                  {
                    "key": "5c",
                    "desc": "Recognize volume as additive. Find volumes of solid figures composed of two non-overlapping right rectangular prisms by adding the volumes of the non-overlapping parts, applying this technique to solve real-world problems."
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "key": "G",
        "desc": "Geometry",
        "clusters": [
          {
            "key": "A",
            "desc": "Graph points on the coordinate plane to solve real-world and mathematical problems.",
            "standards": [
              {
                "key": "1",
                "desc": "Use a pair of perpendicular number lines, called axes, to define a coordinate system."
              },
              {
                "key": "2",
                "desc": "Represent real-world and mathematical problems by graphing points in the first quadrant of the coordinate plane."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Classify two-dimensional figures into categories based on their properties.",
            "standards": [
              {
                "key": "3",
                "desc": "Understand that attributes belonging to a category of two-dimensional figures also belong to all subcategories of that category."
              },
              {
                "key": "4",
                "desc": "Classify two-dimensional figures in a hierarchy based on properties."
              }
            ]
          }
        ]
      }
    ]
  },  
  {
    "key": "4",
    "desc": "4th",
    "domains": [
      {
        "key": "OA",
        "desc": "Operations and Algebraic Thinking",
        "clusters": [
          {
            "key": "A",
            "desc": "Use the four operations with whole numbers to solve problems.",
            "standards": [
              {
                "key": "1",
                "desc": "Interpret a multiplication equation as a comparison, e.g., interpret 35 = 5 × 7 as a statement that 35 is 5 times as many as 7 and 7 times as many as 5. Represent verbal statements of multiplicative comparisons as multiplication equations."
              },
              {
                "key": "2",
                "desc": "Multiply or divide to solve word problems involving multiplicative comparison, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem, distinguishing multiplicative comparison from additive comparison."
              },
              {
                "key": "3",
                "desc": "Solve multistep word problems posed with whole numbers and having whole-number answers using the four operations, including problems in which remainders must be interpreted. Represent these problems using equations with a letter standing for the unknown quantity. Assess the reasonableness of answers using mental computation and estimation strategies including rounding."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Gain familiarity with factors and multiples.",
            "standards": [
              {
                "key": "4",
                "desc": "Find all factor pairs for a whole number in the range 1–100. Recognize that a whole number is a multiple of each of its factors. Determine whether a given whole number in the range 1–100 is a multiple of a given one-digit number. Determine whether a given whole number in the range 1–100 is prime or composite."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Generate and analyze patterns.",
            "standards": [
              {
                "key": "5",
                "desc": "Generate a number or shape pattern that follows a given rule. Identify apparent features of the pattern that were not explicit in the rule itself. For example, given the rule \"Add 3\" and the starting number 1, generate terms in the resulting sequence and observe that the terms appear to alternate between odd and even numbers."
              }
            ]
          }
        ]
      },
      {
        "key": "NBT",
        "desc": "Number and Operations in Base Ten",
        "clusters": [
          {
            "key": "A",
            "desc": "Generalize place value understanding for multi-digit whole numbers.",
            "standards": [
              {
                "key": "1",
                "desc": "Recognize that in a multi-digit whole number, a digit in one place represents ten times what it represents in the place to its right. For example, recognize that 700 ÷ 70 = 10 by applying concepts of place value and division."
              },
              {
                "key": "2",
                "desc": "Read and write multi-digit whole numbers using base-ten numerals, number names, and expanded form. Compare two multi-digit numbers based on meanings of the digits in each place, using >, =, and < symbols to record the results of comparisons."
              },
              {
                "key": "3",
                "desc": "Use place value understanding to round multi-digit whole numbers to any place."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Use place value understanding and properties of operations to perform multi-digit arithmetic.",
            "standards": [
              {
                "key": "4",
                "desc": "Fluently add and subtract multi-digit whole numbers using the standard algorithm."
              },
              {
                "key": "5",
                "desc": "Multiply a whole number of up to four digits by a one-digit whole number, and multiply two two-digit numbers, using strategies based on place value and the properties of operations. Illustrate and explain the calculation by using equations, rectangular arrays, and/or area models."
              },
              {
                "key": "6",
                "desc": "Find whole-number quotients and remainders with up to four-digit dividends and one-digit divisors, using strategies based on place value, the properties of operations, and/or the relationship between multiplication and division."
              }
            ]
          }
        ]
      },
      {
        "key": "NF",
        "desc": "Number and Operations—Fractions",
        "clusters": [
          {
            "key": "A",
            "desc": "Extend understanding of fraction equivalence and ordering.",
            "standards": [
              {
                "key": "1",
                "desc": "Explain why a fraction a⁄b is equivalent to a fraction (n × a)⁄(n × b) by using visual fraction models, with attention to how the number and size of the parts differ even though the two fractions themselves are the same size."
              },
              {
                "key": "2",
                "desc": "Compare two fractions with different numerators and different denominators, e.g., by creating common denominators or numerators, or by comparing to a benchmark fraction such as 1⁄2. Recognize that comparisons are valid only when the two fractions refer to the same whole."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.",
            "standards": [
              {
                "key": "3",
                "desc": "Understand a fraction a⁄b with a > 1 as a sum of fractions 1⁄b.",
                "subStandards": [
                  {
                    "key": "3a",
                    "desc": "Understand addition and subtraction of fractions as joining and separating parts referring to the same whole."
                  },
                  {
                    "key": "3b",
                    "desc": "Decompose a fraction into a sum of fractions with the same denominator in more than one way."
                  },
                  {
                    "key": "3c",
                    "desc": "Add and subtract mixed numbers with like denominators."
                  },
                  {
                    "key": "3d",
                    "desc": "Solve word problems involving addition and subtraction of fractions referring to the same whole and having like denominators."
                  }
                ]
              },
              {
                "key": "4",
                "desc": "Apply and extend previous understandings of multiplication to multiply a fraction by a whole number.",
                "subStandards": [
                  {
                    "key": "4a",
                    "desc": "Understand a fraction a⁄b as a multiple of 1⁄b."
                  },
                  {
                    "key": "4b",
                    "desc": "Understand a multiple of a⁄b as a multiple of 1⁄b, and use this understanding to multiply a fraction by a whole number."
                  },
                  {
                    "key": "4c",
                    "desc": "Solve word problems involving multiplication of a fraction by a whole number."
                  }
                ]
              }
            ]
          },
          {
            "key": "C",
            "desc": "Understand decimal notation for fractions, and compare decimal fractions.",
            "standards": [
              {
                "key": "5",
                "desc": "Express a fraction with denominator 10 as an equivalent fraction with denominator 100, and use this technique to add two fractions with respective denominators 10 and 100."
              },
              {
                "key": "6",
                "desc": "Use decimal notation for fractions with denominators 10 or 100."
              },
              {
                "key": "7",
                "desc": "Compare two decimals to hundredths by reasoning about their size."
              }
            ]
          }
        ]
      },
      {
        "key": "MD",
        "desc": "Measurement and Data",
        "clusters": [
          {
            "key": "A",
            "desc": "Solve problems involving measurement and conversion of measurements from a larger unit to a smaller unit.",
            "standards": [
              {
                "key": "1",
                "desc": "Know relative sizes of measurement units within one system of units including km, m, cm; kg, g; lb, oz.; l, ml; hr, min, sec. Within a single system of measurement, express measurements in a larger unit in terms of a smaller unit."
              },
              {
                "key": "2",
                "desc": "Use the four operations to solve word problems involving distances, intervals of time, liquid volumes, masses of objects, and money."
              },
              {
                "key": "3",
                "desc": "Apply the area and perimeter formulas for rectangles in real world and mathematical problems."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Represent and interpret data.",
            "standards": [
              {
                "key": "4",
                "desc": "Make a line plot to display a data set of measurements in fractions of a unit (1⁄2, 1⁄4, 1⁄8). Solve problems involving addition and subtraction of fractions by using information presented in line plots."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Geometric measurement: understand concepts of angle and measure angles.",
            "standards": [
              {
                "key": "5",
                "desc": "Recognize angles as geometric shapes that are formed wherever two rays share a common endpoint.",
                "subStandards": [
                  {
                    "key": "5a",
                    "desc": "An angle is measured with reference to a circle with its center at the common endpoint of the rays."
                  },
                  {
                    "key": "5b",
                    "desc": "An angle that turns through n one-degree angles is said to have an angle measure of n degrees."
                  }
                ]
              },
              {
                "key": "6",
                "desc": "Measure angles in whole-number degrees using a protractor. Sketch angles of specified measure."
              },
              {
                "key": "7",
                "desc": "Recognize angle measure as additive. Solve addition and subtraction problems to find unknown angles on a diagram."
              }
            ]
          }
        ]
      },
      {
        "key": "G",
        "desc": "Geometry",
        "clusters": [
          {
            "key": "A",
            "desc": "Draw and identify lines and angles, and classify shapes by properties of their lines and angles.",
            "standards": [
              {
                "key": "1",
                "desc": "Draw points, lines, line segments, rays, angles (right, acute, obtuse), and perpendicular and parallel lines. Identify these in two-dimensional figures."
              },
              {
                "key": "2",
                "desc": "Classify two-dimensional figures based on the presence or absence of parallel or perpendicular lines, or the presence or absence of angles of a specified size. Recognize right triangles as a category, and identify right triangles."
              },
              {
                "key": "3",
                "desc": "Recognize a line of symmetry for a two-dimensional figure as a line across the figure such that the figure can be folded along the line into matching parts. Identify line-symmetric figures and draw lines of symmetry."
              }
            ]
          }
        ]
      }
    ]
  },  
  {
    "key": "3",
    "desc": "3rd",
    "domains": [
      {
        "key": "OA",
        "desc": "Operations and Algebraic Thinking",
        "clusters": [
          {
            "key": "A",
            "desc": "Represent and solve problems involving multiplication and division.",
            "standards": [
              {
                "key": "1",
                "desc": "Interpret products of whole numbers, e.g., interpret 5 × 7 as the total number of objects in 5 groups of 7 objects each."
              },
              {
                "key": "2",
                "desc": "Interpret whole-number quotients of whole numbers, e.g., interpret 56 ÷ 8 as the number of objects in each share when 56 objects are partitioned equally into 8 shares."
              },
              {
                "key": "3",
                "desc": "Use multiplication and division within 100 to solve word problems in situations involving equal groups, arrays, and measurement quantities."
              },
              {
                "key": "4",
                "desc": "Determine the unknown whole number in a multiplication or division equation relating three whole numbers."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Understand properties of multiplication and the relationship between multiplication and division.",
            "standards": [
              {
                "key": "5",
                "desc": "Apply properties of operations as strategies to multiply and divide."
              },
              {
                "key": "6",
                "desc": "Understand division as an unknown-factor problem."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Multiply and divide within 100.",
            "standards": [
              {
                "key": "7",
                "desc": "Fluently multiply and divide within 100, using strategies such as the relationship between multiplication and division or properties of operations."
              }
            ]
          },
          {
            "key": "D",
            "desc": "Solve problems involving the four operations, and identify and explain patterns in arithmetic.",
            "standards": [
              {
                "key": "8",
                "desc": "Solve two-step word problems using the four operations."
              },
              {
                "key": "9",
                "desc": "Identify arithmetic patterns (including patterns in the addition table or multiplication table), and explain them using properties of operations."
              }
            ]
          }
        ]
      },
      {
        "key": "NBT",
        "desc": "Number and Operations in Base Ten",
        "clusters": [
          {
            "key": "A",
            "desc": "Use place value understanding and properties of operations to perform multi-digit arithmetic.",
            "standards": [
              {
                "key": "1",
                "desc": "Use place value understanding to round whole numbers to the nearest 10 or 100."
              },
              {
                "key": "2",
                "desc": "Fluently add and subtract within 1,000 using strategies and algorithms based on place value, properties of operations, and the relationship between addition and subtraction."
              },
              {
                "key": "3",
                "desc": "Multiply one-digit whole numbers by multiples of 10 in the range 10–90."
              }
            ]
          }
        ]
      },
      {
        "key": "NF",
        "desc": "Number and Operations—Fractions",
        "clusters": [
          {
            "key": "A",
            "desc": "Develop understanding of fractions as numbers.",
            "standards": [
              {
                "key": "1",
                "desc": "Understand a fraction 1⁄b as the quantity formed by 1 part when a whole is partitioned into b equal parts."
              },
              {
                "key": "2",
                "desc": "Understand a fraction as a number on the number line; represent fractions on a number line diagram.",
                "subStandards": [
                  {
                    "key": "2a",
                    "desc": "Represent a fraction 1⁄b on a number line diagram."
                  },
                  {
                    "key": "2b",
                    "desc": "Represent a fraction a⁄b on a number line diagram."
                  }
                ]
              },
              {
                "key": "3",
                "desc": "Explain equivalence of fractions in special cases, and compare fractions by reasoning about their size.",
                "subStandards": [
                  {
                    "key": "3a",
                    "desc": "Understand two fractions as equivalent if they are the same size, or the same point on a number line."
                  },
                  {
                    "key": "3b",
                    "desc": "Recognize and generate simple equivalent fractions."
                  },
                  {
                    "key": "3c",
                    "desc": "Express whole numbers as fractions, and recognize fractions that are equivalent to whole numbers."
                  },
                  {
                    "key": "3d",
                    "desc": "Compare two fractions with the same numerator or the same denominator by reasoning about their size."
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "key": "MD",
        "desc": "Measurement and Data",
        "clusters": [
          {
            "key": "A",
            "desc": "Solve problems involving measurement and estimation of intervals of time, liquid volumes, and masses of objects.",
            "standards": [
              {
                "key": "1",
                "desc": "Tell and write time to the nearest minute and measure time intervals in minutes."
              },
              {
                "key": "2",
                "desc": "Measure and estimate liquid volumes and masses of objects using standard units of grams (g), kilograms (kg), and liters (l)."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Represent and interpret data.",
            "standards": [
              {
                "key": "3",
                "desc": "Draw a scaled picture graph and a scaled bar graph to represent a data set with several categories."
              },
              {
                "key": "4",
                "desc": "Generate measurement data by measuring lengths using rulers marked with halves and fourths of an inch."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Geometric measurement: understand concepts of area and relate area to multiplication and to addition.",
            "standards": [
              {
                "key": "5",
                "desc": "Recognize area as an attribute of plane figures and understand concepts of area measurement.",
                "subStandards": [
                  {
                    "key": "5a",
                    "desc": "A square with side length 1 unit is said to have \"one square unit\" of area."
                  },
                  {
                    "key": "5b",
                    "desc": "A plane figure which can be covered without gaps or overlaps by n unit squares has an area of n square units."
                  }
                ]
              },
              {
                "key": "6",
                "desc": "Measure areas by counting unit squares."
              },
              {
                "key": "7",
                "desc": "Relate area to the operations of multiplication and addition.",
                "subStandards": [
                  {
                    "key": "7a",
                    "desc": "Find the area of a rectangle with whole-number side lengths by tiling it."
                  },
                  {
                    "key": "7b",
                    "desc": "Multiply side lengths to find areas of rectangles with whole-number side lengths."
                  },
                  {
                    "key": "7c",
                    "desc": "Use tiling to show that the area of a rectangle with side lengths a and b + c is the sum of a × b and a × c."
                  },
                  {
                    "key": "7d",
                    "desc": "Recognize area as additive; find areas of rectilinear figures by decomposing them into non-overlapping rectangles."
                  }
                ]
              }
            ]
          },
          {
            "key": "D",
            "desc": "Geometric measurement: recognize perimeter as an attribute of plane figures and distinguish between linear and area measures.",
            "standards": [
              {
                "key": "8",
                "desc": "Solve real-world and mathematical problems involving perimeters of polygons."
              }
            ]
          }
        ]
      },
      {
        "key": "G",
        "desc": "Geometry",
        "clusters": [
          {
            "key": "A",
            "desc": "Reason with shapes and their attributes.",
            "standards": [
              {
                "key": "1",
                "desc": "Understand that shapes in different categories may share attributes, and that the shared attributes can define a larger category."
              },
              {
                "key": "2",
                "desc": "Partition shapes into parts with equal areas. Express the area of each part as a unit fraction of the whole."
              }
            ]
          }
        ]
      }
    ]
  },  
  {
    "key": "2",
    "desc": "2nd",
    "domains": [
      {
        "key": "OA",
        "desc": "Operations and Algebraic Thinking",
        "clusters": [
          {
            "key": "A",
            "desc": "Represent and solve problems involving addition and subtraction.",
            "standards": [
              {
                "key": "1",
                "desc": "Use addition and subtraction within 100 to solve one- and two-step word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Add and subtract within 20.",
            "standards": [
              {
                "key": "2",
                "desc": "Fluently add and subtract within 20 using mental strategies. By end of Grade 2, know from memory all sums of two one-digit numbers."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Work with equal groups of objects to gain foundations for multiplication.",
            "standards": [
              {
                "key": "3",
                "desc": "Determine whether a group of objects (up to 20) has an odd or even number of members; write an equation to express an even number as a sum of two equal addends."
              },
              {
                "key": "4",
                "desc": "Use addition to find the total number of objects arranged in rectangular arrays with up to 5 rows and up to 5 columns; write an equation to express the total as a sum of equal addends."
              }
            ]
          }
        ]
      },
      {
        "key": "NBT",
        "desc": "Number and Operations in Base Ten",
        "clusters": [
          {
            "key": "A",
            "desc": "Understand place value.",
            "standards": [
              {
                "key": "1",
                "desc": "Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones.",
                "subStandards": [
                  {
                    "key": "1a",
                    "desc": "100 can be thought of as a bundle of ten tens — called a “hundred.”"
                  },
                  {
                    "key": "1b",
                    "desc": "The numbers 100, 200, 300, 400, 500, 600, 700, 800, 900 refer to one to nine hundreds (and 0 tens and 0 ones)."
                  }
                ]
              },
              {
                "key": "2",
                "desc": "Count within 1000; skip-count by 5s, 10s, and 100s."
              },
              {
                "key": "3",
                "desc": "Read and write numbers to 1000 using base-ten numerals, number names, and expanded form."
              },
              {
                "key": "4",
                "desc": "Compare two three-digit numbers based on meanings of the hundreds, tens, and ones digits, using >, =, and < symbols to record the results of comparisons."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Use place value understanding and properties of operations to add and subtract.",
            "standards": [
              {
                "key": "5",
                "desc": "Fluently add and subtract within 100 using strategies based on place value, properties of operations, and/or the relationship between addition and subtraction."
              },
              {
                "key": "6",
                "desc": "Add up to four two-digit numbers using strategies based on place value and properties of operations."
              },
              {
                "key": "7",
                "desc": "Add and subtract within 1000 using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction."
              },
              {
                "key": "8",
                "desc": "Mentally add 10 or 100 to a given number 100–900, and mentally subtract 10 or 100 from a given number 100–900."
              },
              {
                "key": "9",
                "desc": "Explain why addition and subtraction strategies work, using place value and the properties of operations."
              }
            ]
          }
        ]
      },
      {
        "key": "MD",
        "desc": "Measurement and Data",
        "clusters": [
          {
            "key": "A",
            "desc": "Measure and estimate lengths in standard units.",
            "standards": [
              {
                "key": "1",
                "desc": "Measure the length of an object by selecting and using appropriate tools such as rulers, yardsticks, meter sticks, and measuring tapes."
              },
              {
                "key": "2",
                "desc": "Measure the length of an object twice, using length units of different lengths for the two measurements; describe how the two measurements relate to the size of the unit chosen."
              },
              {
                "key": "3",
                "desc": "Estimate lengths using units of inches, feet, centimeters, and meters."
              },
              {
                "key": "4",
                "desc": "Measure to determine how much longer one object is than another, expressing the length difference in terms of a standard length unit."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Relate addition and subtraction to length.",
            "standards": [
              {
                "key": "5",
                "desc": "Use addition and subtraction within 100 to solve word problems involving lengths that are given in the same units."
              },
              {
                "key": "6",
                "desc": "Represent whole numbers as lengths from 0 on a number line diagram with equally spaced points."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Work with time and money.",
            "standards": [
              {
                "key": "7",
                "desc": "Tell and write time from analog and digital clocks to the nearest five minutes, using a.m. and p.m."
              },
              {
                "key": "8",
                "desc": "Solve word problems involving dollar bills, quarters, dimes, nickels, and pennies, using $ and ¢ symbols appropriately."
              }
            ]
          },
          {
            "key": "D",
            "desc": "Represent and interpret data.",
            "standards": [
              {
                "key": "9",
                "desc": "Generate measurement data by measuring lengths of several objects to the nearest whole unit, or by making repeated measurements of the same object."
              },
              {
                "key": "10",
                "desc": "Draw a picture graph and a bar graph (with single-unit scale) to represent a data set with up to four categories."
              }
            ]
          }
        ]
      },
      {
        "key": "G",
        "desc": "Geometry",
        "clusters": [
          {
            "key": "A",
            "desc": "Reason with shapes and their attributes.",
            "standards": [
              {
                "key": "1",
                "desc": "Recognize and draw shapes having specified attributes; identify triangles, quadrilaterals, pentagons, hexagons, and cubes."
              },
              {
                "key": "2",
                "desc": "Partition a rectangle into rows and columns of same-size squares and count to find the total number of them."
              },
              {
                "key": "3",
                "desc": "Partition circles and rectangles into two, three, or four equal shares; describe the shares using the words halves, thirds, half of, a third of, etc."
              }
            ]
          }
        ]
      }
    ]
  },  
  {
    "key": "1",
    "desc": "1st",
    "domains": [
      {
        "key": "OA",
        "desc": "Operations and Algebraic Thinking",
        "clusters": [
          {
            "key": "A",
            "desc": "Represent and solve problems involving addition and subtraction.",
            "standards": [
              {
                "key": "1",
                "desc": "Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions."
              },
              {
                "key": "2",
                "desc": "Solve word problems that call for addition of three whole numbers whose sum is less than or equal to 20."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Understand and apply properties of operations and the relationship between addition and subtraction.",
            "standards": [
              {
                "key": "3",
                "desc": "Apply properties of operations as strategies to add and subtract."
              },
              {
                "key": "4",
                "desc": "Understand subtraction as an unknown-addend problem."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Add and subtract within 20.",
            "standards": [
              {
                "key": "5",
                "desc": "Relate counting to addition and subtraction."
              },
              {
                "key": "6",
                "desc": "Add and subtract within 20, demonstrating fluency for addition and subtraction within 10."
              }
            ]
          },
          {
            "key": "D",
            "desc": "Work with addition and subtraction equations.",
            "standards": [
              {
                "key": "7",
                "desc": "Understand the meaning of the equal sign, and determine if equations involving addition and subtraction are true or false."
              },
              {
                "key": "8",
                "desc": "Determine the unknown whole number in an addition or subtraction equation relating three whole numbers."
              }
            ]
          }
        ]
      },
      {
        "key": "NBT",
        "desc": "Number and Operations in Base Ten",
        "clusters": [
          {
            "key": "A",
            "desc": "Extend the counting sequence.",
            "standards": [
              {
                "key": "1",
                "desc": "Count to 120, starting at any number less than 120. In this range, read and write numerals and represent a number of objects with a written numeral."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Understand place value.",
            "standards": [
              {
                "key": "2",
                "desc": "Understand that the two digits of a two-digit number represent amounts of tens and ones.",
                "subStandards": [
                  {
                    "key": "2a",
                    "desc": "10 can be thought of as a bundle of ten ones — called a “ten.”"
                  },
                  {
                    "key": "2b",
                    "desc": "The numbers from 11 to 19 are composed of a ten and one to nine ones."
                  },
                  {
                    "key": "2c",
                    "desc": "The numbers 10, 20, 30, ..., 90 refer to one to nine tens (and 0 ones)."
                  }
                ]
              },
              {
                "key": "3",
                "desc": "Compare two two-digit numbers based on meanings of the tens and ones digits, recording the results of comparisons with the symbols >, =, and <."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Use place value understanding and properties of operations to add and subtract.",
            "standards": [
              {
                "key": "4",
                "desc": "Add within 100, including adding a two-digit number and a one-digit number, and adding a two-digit number and a multiple of 10."
              },
              {
                "key": "5",
                "desc": "Given a two-digit number, mentally find 10 more or 10 less than the number, without having to count."
              },
              {
                "key": "6",
                "desc": "Subtract multiples of 10 in the range 10–90 from multiples of 10 in the range 10–90."
              }
            ]
          }
        ]
      },
      {
        "key": "MD",
        "desc": "Measurement and Data",
        "clusters": [
          {
            "key": "A",
            "desc": "Measure lengths indirectly and by iterating length units.",
            "standards": [
              {
                "key": "1",
                "desc": "Order three objects by length; compare the lengths of two objects indirectly by using a third object."
              },
              {
                "key": "2",
                "desc": "Express the length of an object as a whole number of length units."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Tell and write time.",
            "standards": [
              {
                "key": "3",
                "desc": "Tell and write time in hours and half-hours using analog and digital clocks."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Represent and interpret data.",
            "standards": [
              {
                "key": "4",
                "desc": "Organize, represent, and interpret data with up to three categories."
              }
            ]
          }
        ]
      },
      {
        "key": "G",
        "desc": "Geometry",
        "clusters": [
          {
            "key": "A",
            "desc": "Reason with shapes and their attributes.",
            "standards": [
              {
                "key": "1",
                "desc": "Distinguish between defining attributes versus non-defining attributes; build and draw shapes to possess defining attributes."
              },
              {
                "key": "2",
                "desc": "Compose two-dimensional or three-dimensional shapes to create a composite shape, and compose new shapes from the composite shape."
              },
              {
                "key": "3",
                "desc": "Partition circles and rectangles into two and four equal shares; describe the shares using the words halves, fourths, and quarters."
              }
            ]
          }
        ]
      }
    ]
  },  
  {
    "key": "K",
    "desc": "K",
    "domains": [
      {
        "key": "CC",
        "desc": "Counting and Cardinality",
        "clusters": [
          {
            "key": "A",
            "desc": "Know number names and the count sequence.",
            "standards": [
              {
                "key": "1",
                "desc": "Count to 100 by ones and by tens."
              },
              {
                "key": "2",
                "desc": "Count forward beginning from a given number within the known sequence (instead of having to begin at 1)."
              },
              {
                "key": "3",
                "desc": "Write numbers from 0 to 20. Represent a number of objects with a written numeral 0–20 (with 0 representing a count of no objects)."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Count to tell the number of objects.",
            "standards": [
              {
                "key": "4",
                "desc": "Understand the relationship between numbers and quantities; connect counting to cardinality.",
                "subStandards": [
                  {
                    "key": "4a",
                    "desc": "When counting objects, say the number names in the standard order, pairing each object with one and only one number name and each number name with one and only one object."
                  },
                  {
                    "key": "4b",
                    "desc": "Understand that the last number name said tells the number of objects counted. The number of objects is the same regardless of their arrangement or the order in which they were counted."
                  },
                  {
                    "key": "4c",
                    "desc": "Understand that each successive number name refers to a quantity that is one larger."
                  }
                ]
              },
              {
                "key": "5",
                "desc": "Count to answer “how many?” questions about as many as 20 things arranged in a line, a rectangular array, or a circle, or as many as 10 things in a scattered configuration; given a number from 1–20, count out that many objects."
              }
            ]
          },
          {
            "key": "C",
            "desc": "Compare numbers.",
            "standards": [
              {
                "key": "6",
                "desc": "Identify whether the number of objects in one group is greater than, less than, or equal to the number of objects in another group, e.g., by using matching and counting strategies."
              },
              {
                "key": "7",
                "desc": "Compare two numbers between 1 and 10 presented as written numerals."
              }
            ]
          }
        ]
      },
      {
        "key": "OA",
        "desc": "Operations and Algebraic Thinking",
        "clusters": [
          {
            "key": "A",
            "desc": "Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.",
            "standards": [
              {
                "key": "1",
                "desc": "Represent addition and subtraction with objects, fingers, mental images, drawings, sounds (e.g., claps), acting out situations, verbal explanations, expressions, or equations."
              },
              {
                "key": "2",
                "desc": "Solve addition and subtraction word problems, and add and subtract within 10, e.g., by using objects or drawings to represent the problem."
              },
              {
                "key": "3",
                "desc": "Decompose numbers less than or equal to 10 into pairs in more than one way."
              },
              {
                "key": "4",
                "desc": "For any number from 1 to 9, find the number that makes 10 when added to the given number."
              },
              {
                "key": "5",
                "desc": "Fluently add and subtract within 5."
              }
            ]
          }
        ]
      },
      {
        "key": "NBT",
        "desc": "Number and Operations in Base Ten",
        "clusters": [
          {
            "key": "A",
            "desc": "Work with numbers 11–19 to gain foundations for place value.",
            "standards": [
              {
                "key": "1",
                "desc": "Compose and decompose numbers from 11 to 19 into ten ones and some further ones."
              }
            ]
          }
        ]
      },
      {
        "key": "MD",
        "desc": "Measurement and Data",
        "clusters": [
          {
            "key": "A",
            "desc": "Describe and compare measurable attributes.",
            "standards": [
              {
                "key": "1",
                "desc": "Describe measurable attributes of objects, such as length or weight. Describe several measurable attributes of a single object."
              },
              {
                "key": "2",
                "desc": "Directly compare two objects with a measurable attribute in common, to see which object has “more of”/“less of” the attribute, and describe the difference."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Classify objects and count the number of objects in each category.",
            "standards": [
              {
                "key": "3",
                "desc": "Classify objects into given categories; count the numbers of objects in each category and sort the categories by count."
              }
            ]
          }
        ]
      },
      {
        "key": "G",
        "desc": "Geometry",
        "clusters": [
          {
            "key": "A",
            "desc": "Identify and describe shapes (squares, circles, triangles, rectangles, hexagons, cubes, cones, cylinders, and spheres).",
            "standards": [
              {
                "key": "1",
                "desc": "Describe objects in the environment using names of shapes, and describe the relative positions of these objects using terms such as above, below, beside, in front of, behind, and next to."
              },
              {
                "key": "2",
                "desc": "Correctly name shapes regardless of their orientations or overall size."
              },
              {
                "key": "3",
                "desc": "Identify shapes as two-dimensional (lying in a plane, “flat”) or three-dimensional (“solid”)."
              }
            ]
          },
          {
            "key": "B",
            "desc": "Analyze, compare, create, and compose shapes.",
            "standards": [
              {
                "key": "4",
                "desc": "Analyze and compare two- and three-dimensional shapes, in different sizes and orientations, using informal language to describe their similarities, differences, parts, and other attributes."
              },
              {
                "key": "5",
                "desc": "Model shapes in the world by building shapes from components (e.g., sticks and clay balls) and drawing shapes."
              },
              {
                "key": "6",
                "desc": "Compose simple shapes to form larger shapes."
              }
            ]
          }
        ]
      }
    ]
  }  
];

export default ccssDictionary;