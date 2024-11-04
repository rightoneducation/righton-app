const ccssDictionary = [
  {
    key: 'HS',
    desc: 'High School',
    domains: [
      {
        key: 'N-RN',
        desc: 'The Real Number System',
        clusters: [
          {
            key: 'A',
            desc: 'Extend the properties of exponents to rational exponents.',
            standards: [
              {
                key: '1',
                desc: 'Explain how the definition of the meaning of rational exponents follows from extending the properties of integer exponents to those values, allowing for a notation for radicals in terms of rational exponents. For example, we define 5^(1/3) to be the cube root of 5 because we want (5^(1/3))^3 = 5.'
              },
              {
                key: '2',
                desc: 'Rewrite expressions involving radicals and rational exponents using the properties of exponents.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Use properties of rational and irrational numbers.',
            standards: [
              {
                key: '3',
                desc: 'Explain why the sum or product of two rational numbers is rational; that the sum of a rational number and an irrational number is irrational; and that the product of a nonzero rational number and an irrational number is irrational.'
              }
            ]
          }
        ]
      },
      {
        key: 'N-Q',
        desc: 'Quantities',
        clusters: [
          {
            key: 'A',
            desc: 'Reason quantitatively and use units to solve problems.',
            standards: [
              {
                key: '1',
                desc: 'Use units as a way to understand problems and to guide the solution of multi-step problems; choose and interpret units consistently in formulas; choose and interpret the scale and the origin in graphs and data displays.'
              },
              {
                key: '2',
                desc: 'Define appropriate quantities for the purpose of descriptive modeling.'
              },
              {
                key: '3',
                desc: 'Choose a level of accuracy appropriate to limitations on measurement when reporting quantities.'
              }
            ]
          }
        ]
      },
      {
        key: 'N-CN',
        desc: 'The Complex Number System',
        clusters: [
          {
            key: 'A',
            desc: 'Perform arithmetic operations with complex numbers.',
            standards: [
              {
                key: '1',
                desc: 'Know there is a complex number i such that i² = –1, and every complex number has the form a + bi with a and b real.'
              },
              {
                key: '2',
                desc: 'Use the relation i² = –1 and the commutative, associative, and distributive properties to add, subtract, and multiply complex numbers.'
              },
              {
                key: '3',
                desc: 'Find the conjugate of a complex number; use conjugates to find moduli and quotients of complex numbers.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Represent complex numbers and their operations on the complex plane.',
            standards: [
              {
                key: '4',
                desc: 'Represent complex numbers on the complex plane in rectangular and polar form (including real and imaginary numbers), and explain why the rectangular and polar forms of a given complex number represent the same number.'
              },
              {
                key: '5',
                desc: 'Represent addition, subtraction, multiplication, and conjugation of complex numbers geometrically on the complex plane; use properties of this representation for computation. For example, (–1 + √3 i)³ = 8 because (–1 + √3 i) has modulus 2 and argument 120°.'
              },
              {
                key: '6',
                desc: 'Calculate the distance between numbers in the complex plane as the modulus of the difference, and the midpoint of a segment as the average of the numbers at its endpoints.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Use complex numbers in polynomial identities and equations.',
            standards: [
              {
                key: '7',
                desc: 'Solve quadratic equations with real coefficients that have complex solutions.'
              },
              {
                key: '8',
                desc: 'Extend polynomial identities to the complex numbers. For example, rewrite x² + 4 as (x + 2i)(x – 2i).'
              },
              {
                key: '9',
                desc: 'Know the Fundamental Theorem of Algebra; show that it is true for quadratic polynomials.'
              }
            ]
          }
        ]
      },
      {
        key: 'N-VM',
        desc: 'Vector and Matrix Quantities',
        clusters: [
          {
            key: 'A',
            desc: 'Represent and model with vector quantities.',
            standards: [
              {
                key: '1',
                desc: 'Recognize vector quantities as having both magnitude and direction. Represent vector quantities by directed line segments, and use appropriate symbols for vectors and their magnitudes (e.g., v, |v|, ||v||, v).'
              },
              {
                key: '2',
                desc: 'Find the components of a vector by subtracting the coordinates of an initial point from the coordinates of a terminal point.'
              },
              {
                key: '3',
                desc: 'Solve problems involving velocity and other quantities that can be represented by vectors.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Perform operations on vectors.',
            standards: [
              {
                key: '4',
                desc: 'Add and subtract vectors.'
              },
              {
                key: '5',
                desc: 'Multiply a vector by a scalar.',
                subStandards: [
                  {
                    key: '5a',
                    desc: 'Add vectors end-to-end, component-wise, and by the parallelogram rule. Understand that the magnitude of a sum of two vectors is typically not the sum of the magnitudes.'
                  },
                  {
                    key: '5b',
                    desc: 'Given two vectors in magnitude and direction form, determine the magnitude and direction of their sum.'
                  },
                  {
                    key: '5c',
                    desc: 'Understand vector subtraction v – w as v + (–w), where –w is the additive inverse of w, with the same magnitude as w and pointing in the opposite direction. Represent vector subtraction graphically by connecting the tips in the appropriate order, and perform vector subtraction component-wise.'
                  },
                  {
                    key: '5d',
                    desc: 'Represent scalar multiplication graphically by scaling vectors and possibly reversing their direction; perform scalar multiplication component-wise, e.g., as c(vx, vy) = (cvx, cvy).'
                  },
                  {
                    key: '5e',
                    desc: 'Compute the magnitude of a scalar multiple cv using ||cv|| = |c|v. Compute the direction of cv knowing that when |c|v ≠ 0, the direction of cv is either along v (for c > 0) or against v (for c < 0).'
                  }
                ]
              }
            ]
          },
          {
            key: 'C',
            desc: 'Perform operations on matrices and use matrices in applications.',
            standards: [
              {
                key: '6',
                desc: 'Use matrices to represent and manipulate data, e.g., to represent payoffs or incidence relationships in a network.'
              },
              {
                key: '7',
                desc: 'Multiply matrices by scalars to produce new matrices, e.g., as when all of the payoffs in a game are doubled.'
              },
              {
                key: '8',
                desc: 'Add, subtract, and multiply matrices of appropriate dimensions.'
              },
              {
                key: '9',
                desc: 'Understand that, unlike multiplication of numbers, matrix multiplication for square matrices is not a commutative operation, but still satisfies the associative and distributive properties.'
              },
              {
                key: '10',
                desc: 'Understand that the zero and identity matrices play a role in matrix addition and multiplication similar to the role of 0 and 1 in the real numbers. The determinant of a square matrix is nonzero if and only if the matrix has a multiplicative inverse.'
              },
              {
                key: '11',
                desc: 'Multiply a vector (regarded as a matrix with one column) by a matrix of suitable dimensions to produce another vector. Work with matrices as transformations of vectors.'
              },
              {
                key: '12',
                desc: 'Work with 2 × 2 matrices as transformations of the plane, and interpret the absolute value of the determinant in terms of area.'
              }
            ]
          }
        ]
      },
      {
        key: 'EE',
        desc: 'Expressions and Equations',
        clusters: [
          {
            key: 'A',
            desc: 'Work with radicals and integer exponents.',
            standards: [
              {
                key: '1',
                desc: 'Know and apply the properties of integer exponents to generate equivalent numerical expressions. For example, 3² × 3⁻⁵ = 3⁻³ = 1/3³ = 1/27.'
              },
              {
                key: '2',
                desc: 'Use square root and cube root symbols to represent solutions to equations of the form x² = p and x³ = p, where p is a positive rational number. Evaluate square roots of small perfect squares and cube roots of small perfect cubes. Know that √2 is irrational.'
              },
              {
                key: '3',
                desc: 'Use numbers expressed in the form of a single digit times an integer power of 10 to estimate very large or very small quantities, and to express how many times as much one is than the other. For example, estimate the population of the United States as 3 × 10⁸ and the population of the world as 7 × 10⁹, and determine that the world population is more than 20 times larger.'
              },
              {
                key: '4',
                desc: 'Perform operations with numbers expressed in scientific notation, including problems where both decimal and scientific notation are used. Use scientific notation and choose units of appropriate size for measurements of very large or very small quantities (e.g., use millimeters per year for seafloor spreading). Interpret scientific notation that has been generated by technology.'
              },
              {
                key: '5',
                desc: 'Understand the connections between proportional relationships, lines, and linear equations.',
                subStandards: [
                  {
                    key: '5a',
                    desc: 'Graph proportional relationships, interpreting the unit rate as the slope of the graph. Compare two different proportional relationships represented in different ways.'
                  },
                  {
                    key: '5b',
                    desc: 'Use similar triangles to explain why the slope m is the same between any two distinct points on a non-vertical line in the coordinate plane; derive the equation y = mx for a line through the origin and the equation y = mx + b for a line intercepting the vertical axis at b.'
                  }
                ]
              },
              {
                key: '6',
                desc: 'Analyze and solve linear equations and pairs of simultaneous linear equations.',
                subStandards: [
                  {
                    key: '6a',
                    desc: 'Solve linear equations in one variable. Give examples of linear equations in one variable with one solution, infinitely many solutions, or no solutions. Show which of these possibilities is the case by successively transforming the given equation into simpler forms, until an equivalent equation of the form x = a, a = a, or a = b results (where a and b are different numbers).'
                  },
                  {
                    key: '6b',
                    desc: 'Solve linear equations with rational number coefficients, including equations whose solutions require expanding expressions using the distributive property and collecting like terms.'
                  },
                  {
                    key: '6c',
                    desc: 'Apply the properties of operations to generate equivalent expressions. For example, apply the distributive property to the expression 3(2 + x) to produce the equivalent expression 6 + 3x; apply the distributive property to the expression 24x + 18y to produce the equivalent expression 6(4x + 3y); apply properties of operations to y + y + y to produce the equivalent expression 3y.'
                  },
                  {
                    key: '6d',
                    desc: 'Identify when two expressions are equivalent (i.e., when the two expressions name the same number regardless of which value is substituted into them). For example, the expressions y + y + y and 3y are equivalent because they name the same number regardless of which number y stands for.'
                  }
                ]
              }
            ]
          },
          {
            key: 'F',
            desc: 'Functions',
            clusters: [
              {
                key: 'A',
                desc: 'Define, evaluate, and compare functions.',
                standards: [
                  {
                    key: '1',
                    desc: 'Understand that a function is a rule that assigns to each input exactly one output. The graph of a function is the set of ordered pairs consisting of an input and the corresponding output.'
                  },
                  {
                    key: '2',
                    desc: 'Use function notation, evaluate functions for inputs in their domains, and interpret statements that use function notation in terms of a context.'
                  },
                  {
                    key: '3',
                    desc: 'Recognize that sequences are functions, sometimes defined recursively, whose domain is a subset of the integers. For example, the Fibonacci sequence is defined recursively by f(0) = f(1) = 1, f(n+1) = f(n) + f(n-1) for n ≥ 1.'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Use functions to model relationships between quantities.',
                standards: [
                  {
                    key: '4',
                    desc: 'Construct a function to model a linear relationship between two quantities. Determine the rate of change and initial value of the function from a description of a relationship or from two (x, y) values, including reading these from a table or from a graph. Interpret the rate of change and initial value of a linear function in terms of the situation it models, and in terms of its graph or a table of values.'
                  },
                  {
                    key: '5',
                    desc: 'Describe qualitatively the functional relationship between two quantities by analyzing a graph (e.g., where the function is increasing or decreasing, linear or nonlinear). Sketch a graph that exhibits the qualitative features of a function that has been described verbally.'
                  }
                ]
              }
            ]
          },
          {
            key: 'a-SSe',
            desc: 'Seeing Structure in Expressions a-SSe',
            clusters: [
              {
                key: 'A',
                desc: 'Interpret the structure of expressions.',
                standards: [
                  {
                    key: '1',
                    desc: 'Interpret expressions that represent a quantity in terms of its context.',
                    subStandards: [
                      {
                        key: '1a',
                        desc: 'Interpret parts of an expression, such as terms, factors, and coefficients.'
                      },
                      {
                        key: '1b',
                        desc: 'Interpret complicated expressions by viewing one or more of their parts as a single entity. For example, interpret P(1+r)^n as the product of P and a factor not depending on P.'
                      }
                    ]
                  },
                  {
                    key: '2',
                    desc: 'Use the structure of an expression to identify ways to rewrite it. For example, see x⁴ – y⁴ as (x²)² – (y²)², thus recognizing it as a difference of squares that can be factored as (x² – y²)(x² + y²).'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Write expressions in equivalent forms to solve problems.',
                standards: [
                  {
                    key: '3',
                    desc: 'Choose and produce an equivalent form of an expression to reveal and explain properties of the quantity represented by the expression.',
                    subStandards: [
                      {
                        key: '3a',
                        desc: 'Factor a quadratic expression to reveal the zeros of the function it defines.'
                      },
                      {
                        key: '3b',
                        desc: 'Complete the square in a quadratic expression to reveal the maximum or minimum value of the function it defines.'
                      },
                      {
                        key: '3c',
                        desc: 'Use the properties of exponents to transform expressions for exponential functions. For example, identify percent rate of change in functions such as y = (1.02)^t, y = (0.97)^t, y = (1.01)^12t, y = (1.2)^(t/10), and classify them as representing exponential growth or decay.'
                      }
                    ]
                  },
                  {
                    key: '4',
                    desc: 'Derive the formula for the sum of a finite geometric series (when the common ratio is not 1), and use the formula to solve problems. For example, calculate mortgage payments.'
                  }
                ]
              }
            ]
          },
          {
            key: 'a-aPr',
            desc: 'Arithmetic with Polynomials and Rational Expressions a-aPr',
            clusters: [
              {
                key: 'A',
                desc: 'Perform arithmetic operations on polynomials.',
                standards: [
                  {
                    key: '1',
                    desc: 'Understand that polynomials form a system analogous to the integers, namely, they are closed under the operations of addition, subtraction, and multiplication; add, subtract, and multiply polynomials.'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Understand the relationship between zeros and factors of polynomials.',
                standards: [
                  {
                    key: '2',
                    desc: 'Know and apply the Remainder Theorem: For a polynomial p(x) and a number a, the remainder on division by x – a is p(a), so p(a) = 0 if and only if (x – a) is a factor of p(x).'
                  },
                  {
                    key: '3',
                    desc: 'Identify zeros of polynomials when suitable factorizations are available, and use the zeros to construct a rough graph of the function defined by the polynomial.'
                  }
                ]
              },
              {
                key: 'C',
                desc: 'Use polynomial identities to solve problems.',
                standards: [
                  {
                    key: '4',
                    desc: 'Prove polynomial identities and use them to describe numerical relationships. For example, the polynomial identity (x² + y²)² = (x² – y²)² + (2xy)² can be used to generate Pythagorean triples.'
                  },
                  {
                    key: '5',
                    desc: 'Know and apply the Binomial Theorem for the expansion of (x + y)^n in powers of x and y for a positive integer n, where x and y are any numbers, with coefficients determined for example by Pascal’s Triangle.'
                  }
                ]
              },
              {
                key: 'D',
                desc: 'Rewrite rational expressions',
                standards: [
                  {
                    key: '6',
                    desc: 'Rewrite simple rational expressions in different forms; write a(x)/b(x) in the form q(x) + r(x)/b(x), where a(x), b(x), q(x), and r(x) are polynomials with the degree of r(x) less than the degree of b(x), using inspection, long division, or, for the more complicated examples, a computer algebra system.'
                  },
                  {
                    key: '7',
                    desc: 'Understand that rational expressions form a system analogous to the rational numbers, closed under addition, subtraction, multiplication, and division by a nonzero rational expression; add, subtract, multiply, and divide rational expressions.'
                  }
                ]
              }
            ]
          },
          {
            key: 'a-reI',
            desc: 'Reasoning with Equations and Inequalities a-reI',
            clusters: [
              {
                key: 'A',
                desc: 'Understand solving equations as a process of reasoning and explain the reasoning.',
                standards: [
                  {
                    key: '1',
                    desc: 'Explain each step in solving a simple equation as following from the equality of numbers asserted at the previous step, starting from the assumption that the original equation has a solution. Construct a viable argument to justify a solution method.'
                  },
                  {
                    key: '2',
                    desc: 'Solve simple rational and radical equations in one variable, and give examples showing how extraneous solutions may arise.'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Solve equations and inequalities in one variable.',
                standards: [
                  {
                    key: '3',
                    desc: 'Solve linear equations and inequalities in one variable, including equations with coefficients represented by letters.'
                  },
                  {
                    key: '4',
                    desc: 'Solve quadratic equations in one variable.',
                    subStandards: [
                      {
                        key: '4a',
                        desc: 'Use the method of completing the square to transform any quadratic equation in x into an equation of the form (x – p)^2 = q that has the same solutions. Derive the quadratic formula from this form.'
                      },
                      {
                        key: '4b',
                        desc: 'Solve quadratic equations by inspection (e.g., for x² = 49), taking square roots, completing the square, the quadratic formula and factoring, as appropriate to the initial form of the equation. Recognize when the quadratic formula gives complex solutions and write them as a ± bi for real numbers a and b.'
                      }
                    ]
                  },
                  {
                    key: '5',
                    desc: 'Prove that, given a system of two equations in two variables, replacing one equation by the sum of that equation and a multiple of the other produces a system with the same solutions.'
                  }
                ]
              }
            ]
          },
          {
            key: 'f-Le',
            desc: 'Linear, Quadratic, and Exponential Models★ f-Le',
            clusters: [
              {
                key: 'A',
                desc: 'Construct and compare linear, quadratic, and exponential models and solve problems.',
                standards: [
                  {
                    key: '1',
                    desc: 'Distinguish between situations that can be modeled with linear functions and with exponential functions.',
                    subStandards: [
                      {
                        key: '1a',
                        desc: 'Prove that linear functions grow by equal differences over equal intervals, and that exponential functions grow by equal factors over equal intervals.'
                      },
                      {
                        key: '1b',
                        desc: 'Recognize situations in which one quantity changes at a constant rate per unit interval relative to another.'
                      },
                      {
                        key: '1c',
                        desc: 'Recognize situations in which a quantity grows or decays by a constant percent rate per unit interval relative to another.'
                      }
                    ]
                  },
                  {
                    key: '2',
                    desc: 'Construct linear and exponential functions, including arithmetic and geometric sequences, given a graph, a description of a relationship, or two input-output pairs (include reading these from a table).'
                  },
                  {
                    key: '3',
                    desc: 'Observe using graphs and tables that a quantity increasing exponentially eventually exceeds a quantity increasing linearly, quadratically, or (more generally) as a polynomial function.'
                  },
                  {
                    key: '4',
                    desc: 'Express the relationship between exponents and logarithms and use it to solve problems involving logarithms and exponents.'
                  },
                  {
                    key: '5',
                    desc: 'Interpret expressions for functions in terms of the situation they model.'
                  }
                ]
              }
            ]
          },
          {
            key: 'f-tf',
            desc: 'Trigonometric Functions f-tf',
            clusters: [
              {
                key: 'A',
                desc: 'Extend the domain of trigonometric functions using the unit circle.',
                standards: [
                  {
                    key: '1',
                    desc: 'Understand radian measure of an angle as the length of the arc on the unit circle subtended by the angle.'
                  },
                  {
                    key: '2',
                    desc: 'Explain how the unit circle in the coordinate plane enables the extension of trigonometric functions to all real numbers, interpreted as radian measures of angles traversed counterclockwise around the unit circle.'
                  },
                  {
                    key: '3',
                    desc: 'Use special triangles to determine geometrically the values of sine, cosine, tangent for π/3, π/4 and π/6, and use the unit circle to express the values of sine, cosine, and tangent for π – x, π + x, and 2π – x in terms of their values for x, where x is any real number.'
                  },
                  {
                    key: '4',
                    desc: 'Use the unit circle to explain symmetry (odd and even) and periodicity of trigonometric functions.'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Model periodic phenomena with trigonometric functions.',
                standards: [
                  {
                    key: '5',
                    desc: 'Choose trigonometric functions to model periodic phenomena with specified amplitude, frequency, and midline.'
                  },
                  {
                    key: '6',
                    desc: 'Understand that restricting a trigonometric function to a domain on which it is always increasing or always decreasing allows its inverse to be constructed.'
                  },
                  {
                    key: '7',
                    desc: 'Use inverse functions to solve trigonometric equations that arise in modeling contexts; evaluate the solutions using technology, and interpret them in terms of the context.'
                  }
                ]
              },
              {
                key: 'C',
                desc: 'Prove and apply trigonometric identities.',
                standards: [
                  {
                    key: '8',
                    desc: 'Prove the Pythagorean identity sin²θ + cos²θ = 1 and use it to find sinθ, cosθ, or tanθ given sinθ, cosθ, or tanθ and the quadrant of the angle.'
                  },
                  {
                    key: '9',
                    desc: 'Prove the addition and subtraction formulas for sine, cosine, and tangent and use them to solve problems.'
                  }
                ]
              }
            ]
          },
      {
        key: 'G-Co',
        desc: 'Congruence G-Co',
        clusters: [
          {
            key: 'A',
            desc: 'Experiment with transformations in the plane.',
            standards: [
              {
                key: '1',
                desc: 'Know precise definitions of angle, circle, perpendicular line, parallel line, and line segment, based on the undefined notions of point, line, distance along a line, and distance around a circular arc.'
              },
              {
                key: '2',
                desc: 'Represent transformations in the plane using, e.g., transparencies and geometry software; describe transformations as functions that take points in the plane as inputs and give other points as outputs. Compare transformations that preserve distance and angle to those that do not (e.g., translation versus horizontal stretch).'
              },
              {
                key: '3',
                desc: 'Given a rectangle, parallelogram, trapezoid, or regular polygon, describe the rotations and reflections that carry it onto itself.'
              },
              {
                key: '4',
                desc: 'Develop definitions of rotations, reflections, and translations in terms of angles, circles, perpendicular lines, parallel lines, and line segments.'
              },
              {
                key: '5',
                desc: 'Given a geometric figure and a rotation, reflection, or translation, draw the transformed figure using, e.g., graph paper, tracing paper, or geometry software. Specify a sequence of transformations that will carry a given figure onto another.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Understand congruence in terms of rigid motions.',
            standards: [
              {
                key: '6',
                desc: 'Use geometric descriptions of rigid motions to transform figures and to predict the effect of a given rigid motion on a given figure; given two figures, use the definition of congruence in terms of rigid motions to decide if they are congruent.'
              },
              {
                key: '7',
                desc: 'Use the definition of congruence in terms of rigid motions to show that two triangles are congruent if and only if corresponding pairs of sides and corresponding pairs of angles are congruent.'
              },
              {
                key: '8',
                desc: 'Explain how the criteria for triangle congruence (ASA, SAS, and SSS) follow from the definition of congruence in terms of rigid motions.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Prove geometric theorems.',
            standards: [
              {
                key: '9',
                desc: 'Prove theorems about lines and angles. Theorems include: vertical angles are congruent; when a transversal crosses parallel lines, alternate interior angles are congruent and corresponding angles are congruent; points on a perpendicular bisector of a line segment are exactly those equidistant from the segment’s endpoints.'
              },
              {
                key: '10',
                desc: 'Prove theorems about triangles. Theorems include: measures of interior angles of a triangle sum to 180°; base angles of isosceles triangles are congruent; the segment joining midpoints of two sides of a triangle is parallel to the third side and half the length; the medians of a triangle meet at a point.'
              },
              {
                key: '11',
                desc: 'Prove theorems about parallelograms. Theorems include: opposite sides are congruent, opposite angles are congruent, the diagonals of a parallelogram bisect each other, and conversely, rectangles are parallelograms with congruent diagonals.'
              }
            ]
          },
          {
            key: 'D',
            desc: 'Make geometric constructions.',
            standards: [
              {
                key: '12',
                desc: 'Make formal geometric constructions with a variety of tools and methods (compass and straightedge, string, reflective devices, paper folding, dynamic geometric software, etc.). Copying a segment; copying an angle; bisecting a segment; bisecting an angle; constructing perpendicular lines, including the perpendicular bisector of a line segment; and constructing a line parallel to a given line through a point not on the line.'
              },
              {
                key: '13',
                desc: 'Construct an equilateral triangle, a square, and a regular hexagon inscribed in a circle.'
              }
            ]
          }
        ]
      },
      {
        key: 'G-Srt',
        desc: 'Similarity, Right Triangles, and Trigonometry G-Srt',
        clusters: [
          {
            key: 'A',
            desc: 'Understand similarity in terms of similarity transformations.',
            standards: [
              {
                key: '1',
                desc: 'Verify experimentally the properties of dilations given by a center and a scale factor.',
                subStandards: [
                  {
                    key: '1a',
                    desc: 'A dilation takes a line not passing through the center of the dilation to a parallel line, and leaves a line passing through the center unchanged.'
                  },
                  {
                    key: '1b',
                    desc: 'The dilation of a line segment is longer or shorter in the ratio given by the scale factor.'
                  }
                ]
              },
              {
                key: '2',
                desc: 'Given two figures, use the definition of similarity in terms of similarity transformations to decide if they are similar; explain using similarity transformations the meaning of similarity for triangles as the equality of all corresponding pairs of angles and the proportionality of all corresponding pairs of sides.'
              },
              {
                key: '3',
                desc: 'Use the properties of similarity transformations to establish the AA criterion for two triangles to be similar.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Prove theorems involving similarity.',
            standards: [
              {
                key: '4',
                desc: 'Prove theorems about triangles. Theorems include: a line parallel to one side of a triangle divides the other two proportionally, and conversely; the Pythagorean Theorem proved using triangle similarity.'
              },
              {
                key: '5',
                desc: 'Use congruence and similarity criteria for triangles to solve problems and to prove relationships in geometric figures.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Define trigonometric ratios and solve problems involving right triangles.',
            standards: [
              {
                key: '6',
                desc: 'Understand that by similarity, side ratios in right triangles are properties of the angles in the triangle, leading to definitions of trigonometric ratios for acute angles.'
              },
              {
                key: '7',
                desc: 'Explain and use the relationship between the sine and cosine of complementary angles.'
              },
              {
                key: '8',
                desc: 'Use trigonometric ratios and the Pythagorean Theorem to solve right triangles in applied problems.'
              }
            ]
          },
          {
            key: 'D',
            desc: 'Apply trigonometry to general triangles.',
            standards: [
              {
                key: '9',
                desc: 'Derive the formula A = (1/2)ab sin(C) for the area of a triangle by drawing an auxiliary line from a vertex perpendicular to the opposite side.'
              },
              {
                key: '10',
                desc: 'Prove the Laws of Sines and Cosines and use them to solve problems.'
              },
              {
                key: '11',
                desc: 'Understand and apply the Law of Sines and the Law of Cosines to find unknown measurements in right and non-right triangles (e.g., surveying problems, resultant forces).'
              }
            ]
          }
        ]
      },
      {
        key: 'G-C',
        desc: 'Circles G-C',
        clusters: [
          {
            key: 'A',
            desc: 'Understand and apply theorems about circles.',
            standards: [
              {
                key: '1',
                desc: 'Prove that all circles are similar.'
              },
              {
                key: '2',
                desc: 'Identify and describe relationships among inscribed angles, radii, and chords. Include the relationship between central, inscribed, and circumscribed angles; inscribed angles on a diameter are right angles; the radius of a circle is perpendicular to the tangent where the radius intersects the circle.'
              },
              {
                key: '3',
                desc: 'Construct the inscribed and circumscribed circles of a triangle, and prove properties of angles for a quadrilateral inscribed in a circle.'
              },
              {
                key: '4',
                desc: 'Construct a tangent line from a point outside a given circle to the circle.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Find arc lengths and areas of sectors of circles.',
            standards: [
              {
                key: '5',
                desc: 'Derive using similarity the fact that the length of the arc intercepted by an angle is proportional to the radius, and define the radian measure of the angle as the constant of proportionality; derive the formula for the area of a sector.'
              }
            ]
          }
        ]
      },
      {
        key: 'G-GPe',
        desc: 'Expressing Geometric Properties with Equations G-GPe',
        clusters: [
          {
            key: 'A',
            desc: 'Translate between the geometric description and the equation for a conic section.',
            standards: [
              {
                key: '1',
                desc: 'Derive the equation of a circle of given center and radius using the Pythagorean Theorem; complete the square to find the center and radius of a circle given by an equation.'
              },
              {
                key: '2',
                desc: 'Derive the equation of a parabola given a focus and directrix.'
              },
              {
                key: '3',
                desc: 'Derive the equations of ellipses and hyperbolas given the foci, using the fact that the sum or difference of distances from the foci is constant.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Use coordinates to prove simple geometric theorems algebraically.',
            standards: [
              {
                key: '4',
                desc: 'Use coordinates to prove simple geometric theorems algebraically. For example, prove or disprove that a figure defined by four given points in the coordinate plane is a rectangle; prove or disprove that the point (1, √3) lies on the circle centered at the origin and containing the point (0, 2).'
              },
              {
                key: '5',
                desc: 'Prove the slope criteria for parallel and perpendicular lines and use them to solve geometric problems (e.g., find the equation of a line parallel or perpendicular to a given line that passes through a given point).'
              },
              {
                key: '6',
                desc: 'Find the point on a directed line segment between two given points that partitions the segment in a given ratio.'
              },
              {
                key: '7',
                desc: 'Use coordinates to compute perimeters of polygons and areas of triangles and rectangles, e.g., using the distance formula.'
              }
                ]
              }
            ]
          },
          {
            key: 'G-Gmd',
            desc: 'Geometric Measurement and Dimension G-Gmd',
            clusters: [
              {
                key: 'A',
                desc: 'Explain volume formulas and use them to solve problems.',
                standards: [
                  {
                    key: '1',
                    desc: 'Give an informal argument for the formulas for the circumference of a circle, area of a circle, volume of a cylinder, pyramid, and cone. Use dissection arguments, Cavalieri’s principle, and informal limit arguments.'
                  },
                  {
                    key: '2',
                    desc: 'Give an informal argument using Cavalieri’s principle for the formulas for the volume of a sphere and other solid figures.'
                  },
                  {
                    key: '3',
                    desc: 'Use volume formulas for cylinders, pyramids, cones, and spheres to solve problems.'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Visualize relationships between two-dimensional and three-dimensional objects.',
                standards: [
                  {
                    key: '4',
                    desc: 'Identify the shapes of two-dimensional cross-sections of three-dimensional objects, and identify three-dimensional objects generated by rotations of two-dimensional objects.'
                  }
                ]
              }
            ]
          },
          {
            key: 'G-mG',
            desc: 'Modeling with Geometry G-mG',
            clusters: [
              {
                key: 'A',
                desc: 'Apply geometric concepts in modeling situations.',
                standards: [
                  {
                    key: '1',
                    desc: 'Use geometric shapes, their measures, and their properties to describe objects (e.g., modeling a tree trunk or a human torso as a cylinder).'
                  },
                  {
                    key: '2',
                    desc: 'Apply concepts of density based on area and volume in modeling situations (e.g., persons per square mile, BTUs per cubic foot).'
                  },
                  {
                    key: '3',
                    desc: 'Apply geometric methods to solve design problems (e.g., designing an object or structure to satisfy physical constraints or minimize cost; working with typographic grid systems based on ratios).'
                  }
                ]
              }
            ]
          },
          {
            key: 'S-Id',
            desc: 'Interpreting Categorical and Quantitative Data S-Id',
            clusters: [
              {
                key: 'A',
                desc: 'Summarize, represent, and interpret data on a single count or measurement variable.',
                standards: [
                  {
                    key: '1',
                    desc: 'Represent data with plots on the real number line (dot plots, histograms, and box plots).'
                  },
                  {
                    key: '2',
                    desc: 'Use statistics appropriate to the shape of the data distribution to compare center (median, mean) and spread (interquartile range, standard deviation) of two or more different data sets.'
                  },
                  {
                    key: '3',
                    desc: 'Interpret differences in shape, center, and spread in the context of the data sets, accounting for possible effects of extreme data points (outliers).'
                  },
                  {
                    key: '4',
                    desc: 'Use the mean and standard deviation of a data set to fit it to a normal distribution and to estimate population percentages. Recognize that there are data sets for which such a procedure is not appropriate.'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Summarize, represent, and interpret data on two categorical and quantitative variables.',
                standards: [
                  {
                    key: '5',
                    desc: 'Summarize categorical data for two categories in two-way frequency tables. Interpret relative frequencies in the context of the data (including joint, marginal, and conditional relative frequencies). Recognize possible associations and trends in the data.'
                  },
                  {
                    key: '6',
                    desc: 'Represent data on two quantitative variables on a scatter plot, and describe how the variables are related.',
                    subStandards: [
                      {
                        key: '6a',
                        desc: 'Fit a function to the data; use functions fitted to data to solve problems in the context of the data. Use given functions or choose a function suggested by the context. Emphasize linear, quadratic, and exponential models.'
                      },
                      {
                        key: '6b',
                        desc: 'Informally assess the fit of a function by plotting and analyzing residuals.'
                      },
                      {
                        key: '6c',
                        desc: 'Fit a linear function for a scatter plot that suggests a linear association.'
                      }
                    ]
                  },
                  {
                    key: '7',
                    desc: 'Interpret the slope (rate of change) and the intercept (constant term) of a linear model in the context of the data.'
                  },
                  {
                    key: '8',
                    desc: 'Calculate (using technology) and interpret the correlation coefficient of a linear fit.'
                  },
                  {
                    key: '9',
                    desc: 'Distinguish between correlation and causation.'
                  }
                ]
              }
            ]
          },
          {
            key: 'S-IC',
            desc: 'Making Inferences and Justifying Conclusions S-IC',
            clusters: [
              {
                key: 'A',
                desc: 'Understand and evaluate random processes underlying statistical experiments.',
                standards: [
                  {
                    key: '1',
                    desc: 'Recognize the purposes of and differences among sample surveys, experiments, and observational studies; explain how randomization relates to each.'
                  },
                  {
                    key: '2',
                    desc: 'Decide if a specified model is consistent with results from a given data-generating process, e.g., using simulation. For example, a model says a spinning coin falls heads up with probability 0.5. Would a result of 5 tails in a row cause you to question the model?'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Make inferences and justify conclusions from sample surveys, experiments, and observational studies.',
                standards: [
                  {
                    key: '3',
                    desc: 'Use data from a sample survey to estimate a population mean or proportion; develop a margin of error through the use of simulation models for random sampling.'
                  },
                  {
                    key: '4',
                    desc: 'Use data from a randomized experiment to compare two treatments; use simulations to decide if differences between parameters are significant.'
                  }
                ]
              }
            ]
          },
          {
            key: 'S-CP',
            desc: 'Conditional Probability and the Rules of Probability S-CP',
            clusters: [
              {
                key: 'A',
                desc: 'Understand independence and conditional probability and use them to interpret data.',
                standards: [
                  {
                    key: '1',
                    desc: 'Describe events as subsets of a sample space (the set of outcomes) using characteristics (or categories) of the outcomes, or as unions, intersections, or complements of other events (“or,” “and,” “not”).'
                  },
                  {
                    key: '2',
                    desc: 'Understand that two events A and B are independent if the probability of A and B occurring together is the product of their probabilities, and use this characterization to determine if they are independent.'
                  },
                  {
                    key: '3',
                    desc: 'Understand the conditional probability of A given B as P(A and B)/P(B), and interpret independence of A and B as saying that the conditional probability of A given B is the same as the probability of A, and the conditional probability of B given A is the same as the probability of B.'
                  },
                  {
                    key: '4',
                    desc: 'Construct and interpret two-way frequency tables of data when two categories are associated with each object being classified. Use the two-way table as a sample space to decide if events are independent and to approximate conditional probabilities. For example, collect data from students in your class on whether or not they have a curfew on school nights and whether or not they have assigned chores at home. Estimate the probability that a randomly selected student from your school will favor science given that the student is in tenth grade. Do the same for other subjects and compare the results.'
                  },
                  {
                    key: '5',
                    desc: 'Describe conditional probability and independence in everyday language and everyday situations.'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Use the rules of probability to compute probabilities of compound events in a uniform probability model.',
                standards: [
                  {
                    key: '6',
                    desc: 'Find the conditional probability of A given B as the fraction of B’s outcomes that also belong to A, and interpret the answer in terms of the model.'
                  },
                  {
                    key: '7',
                    desc: 'Apply the Addition Rule, P(A or B) = P(A) + P(B) – P(A and B), and interpret the answer in terms of the model.'
                  },
                  {
                    key: '8',
                    desc: 'Apply the general Multiplication Rule in a uniform probability model, P(A and B) = P(A)P(B|A) = P(B)P(A|B), and interpret the answer in terms of the model.'
                  },
                  {
                    key: '9',
                    desc: 'Use permutations and combinations to compute probabilities of compound events and solve problems.'
                  }
                ]
              },
              {
                key: 'C',
                desc: 'Use probability to evaluate outcomes of decisions.',
                standards: [
                  {
                    key: '1',
                    desc: 'Define a random variable for a quantity of interest by assigning a numerical value to each event in a sample space; graph the corresponding probability distribution using the same graphical displays as for data distributions.'
                  },
                  {
                    key: '2',
                    desc: 'Calculate and interpret the expected value of a random variable; interpret it as the mean of the probability distribution.'
                  },
                  {
                    key: '3',
                    desc: 'Develop a probability distribution for a random variable defined for a sample space in which theoretical probabilities can be calculated; find the expected value. For example, find the theoretical probability distribution for the number of correct answers obtained by guessing on all five questions of a multiple-choice test where each question has four choices, and find the expected grade under various grading schemes.'
                  },
                  {
                    key: '4',
                    desc: 'Develop a probability distribution for a random variable defined for a sample space in which probabilities are assigned empirically; find the expected value. For example, find a current data distribution on the number of TV sets per household in the United States, and calculate the expected number of sets per household. How many TV sets would you expect to find in 100 randomly selected households?'
                  },
                  {
                    key: '5',
                    desc: 'Weigh the possible outcomes of a decision by assigning probabilities to payoff values and finding expected values.'
                  },
                  {
                    key: '6',
                    desc: 'Use probabilities to make fair decisions (e.g., drawing by lots, using a random number generator).'
                  },
                  {
                    key: '7',
                    desc: 'Analyze decisions and strategies using probability concepts (e.g., product testing, medical testing, pulling a hockey goalie at the end of a game).'
                  }
                ]
              }
            ]
          },
          {
            key: 'S-md',
            desc: 'Using Probability to Make Decisions S-md',
            clusters: [
              {
                key: 'A',
                desc: 'Weigh the possible outcomes of a decision by assigning probabilities to payoff values and finding expected values.',
                standards: [
                  {
                    key: '1',
                    desc: 'Find the expected payoff for a game of chance. For example, find the expected winnings from a state lottery ticket or a game at a fast-food restaurant.'
                  },
                  {
                    key: '2',
                    desc: 'Evaluate and compare strategies on the basis of expected values. For example, compare a high-deductible versus a low-deductible automobile insurance policy using various, but reasonable, chances of having a minor or a major accident.'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Use probabilities to make fair decisions (e.g., drawing by lots, using a random number generator).',
                standards: [
                  {
                    key: '3',
                    desc: 'Use probabilities to make fair decisions (e.g., drawing by lots, using a random number generator).'
                  }
                ]
              },
              {
                key: 'C',
                desc: 'Analyze decisions and strategies using probability concepts (e.g., product testing, medical testing, pulling a hockey goalie at the end of a game).',
                standards: [
                  {
                    key: '4',
                    desc: 'Analyze decisions and strategies using probability concepts (e.g., product testing, medical testing, pulling a hockey goalie at the end of a game).'
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
    key: '8',
    desc: '8th',
    domains: [
      {
        key: 'NS',
        desc: 'The Number System',
        clusters: [
          {
            key: 'A',
            desc: 'Know that there are numbers that are not rational, and approximate them by rational numbers.',
            standards: [
              {
                key: '1',
                desc: 'Know that there are numbers that are not rational, and approximate them by rational numbers.',
                subStandards: [
                  {
                    key: '1a',
                    desc: 'Know that numbers that are not rational are called irrational. Understand informally that every number has a decimal expansion; for rational numbers show that the decimal expansion repeats eventually, and convert a decimal expansion which repeats eventually into a rational number.'
                  },
                  {
                    key: '1b',
                    desc: 'Use rational approximations of irrational numbers to compare the size of irrational numbers, locate them approximately on a number line diagram, and estimate the value of expressions (e.g., π²). For example, by truncating the decimal expansion of √2, show that √2 is between 1 and 2, then between 1.4 and 1.5, and explain how to continue on to get better approximations.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        key: 'EE',
        desc: 'Expressions and Equations',
        clusters: [
          {
            key: 'A',
            desc: 'Work with radicals and integer exponents.',
            standards: [
              {
                key: '1',
                desc: 'Know and apply the properties of integer exponents to generate equivalent numerical expressions. For example, 3² × 3⁻⁵ = 3⁻³ = 1/3³ = 1/27.'
              },
              {
                key: '2',
                desc: 'Use square root and cube root symbols to represent solutions to equations of the form x² = p and x³ = p, where p is a positive rational number. Evaluate square roots of small perfect squares and cube roots of small perfect cubes. Know that √2 is irrational.'
              },
              {
                key: '3',
                desc: 'Use numbers expressed in the form of a single digit times an integer power of 10 to estimate very large or very small quantities, and to express how many times as much one is than the other. For example, estimate the population of the United States as 3 × 10⁸ and the population of the world as 7 × 10⁹, and determine that the world population is more than 20 times larger.'
              },
              {
                key: '4',
                desc: 'Perform operations with numbers expressed in scientific notation, including problems where both decimal and scientific notation are used. Use scientific notation and choose units of appropriate size for measurements of very large or very small quantities (e.g., use millimeters per year for seafloor spreading). Interpret scientific notation that has been generated by technology.'
              },
              {
                key: '5',
                desc: 'Understand the connections between proportional relationships, lines, and linear equations.',
                subStandards: [
                  {
                    key: '5a',
                    desc: 'Graph proportional relationships, interpreting the unit rate as the slope of the graph. Compare two different proportional relationships represented in different ways.'
                  },
                  {
                    key: '5b',
                    desc: 'Use similar triangles to explain why the slope m is the same between any two distinct points on a non-vertical line in the coordinate plane; derive the equation y = mx for a line through the origin and the equation y = mx + b for a line intercepting the vertical axis at b.'
                  }
                ]
              },
              {
                key: '6',
                desc: 'Analyze and solve linear equations and pairs of simultaneous linear equations.',
                subStandards: [
                  {
                    key: '6a',
                    desc: 'Solve linear equations in one variable. Give examples of linear equations in one variable with one solution, infinitely many solutions, or no solutions. Show which of these possibilities is the case by successively transforming the given equation into simpler forms, until an equivalent equation of the form x = a, a = a, or a = b results (where a and b are different numbers).'
                  },
                  {
                    key: '6b',
                    desc: 'Solve linear equations with rational number coefficients, including equations whose solutions require expanding expressions using the distributive property and collecting like terms.'
                  },
                  {
                    key: '6c',
                    desc: 'Apply the properties of operations to generate equivalent expressions. For example, apply the distributive property to the expression 3(2 + x) to produce the equivalent expression 6 + 3x; apply the distributive property to the expression 24x + 18y to produce the equivalent expression 6(4x + 3y); apply properties of operations to y + y + y to produce the equivalent expression 3y.'
                  },
                  {
                    key: '6d',
                    desc: 'Identify when two expressions are equivalent (i.e., when the two expressions name the same number regardless of which value is substituted into them). For example, the expressions y + y + y and 3y are equivalent because they name the same number regardless of which number y stands for.'
                  }
                ]
              }
            ]
          },
          {
            key: 'F',
            desc: 'Functions',
            clusters: [
              {
                key: 'A',
                desc: 'Define, evaluate, and compare functions.',
                standards: [
                  {
                    key: '1',
                    desc: 'Understand that a function is a rule that assigns to each input exactly one output. The graph of a function is the set of ordered pairs consisting of an input and the corresponding output.'
                  },
                  {
                    key: '2',
                    desc: 'Compare properties of two functions each represented in a different way (algebraically, graphically, numerically in tables, or by verbal descriptions). For example, given a linear function represented by a table of values and a linear function represented by an algebraic expression, determine which function has the greater rate of change.'
                  },
                  {
                    key: '3',
                    desc: 'Interpret the equation y = mx + b as defining a linear function, whose graph is a straight line; give examples of functions that are not linear. For example, the function A = s² giving the area of a square as a function of its side length is not linear because its graph contains the points (1,1), (2,4) and (3,9), which are not on a straight line.'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Use functions to model relationships between quantities.',
                standards: [
                  {
                    key: '4',
                    desc: 'Construct a function to model a linear relationship between two quantities. Determine the rate of change and initial value of the function from a description of a relationship or from two (x, y) values, including reading these from a table or from a graph. Interpret the rate of change and initial value of a linear function in terms of the situation it models, and in terms of its graph or a table of values.'
                  },
                  {
                    key: '5',
                    desc: 'Describe qualitatively the functional relationship between two quantities by analyzing a graph (e.g., where the function is increasing or decreasing, linear or nonlinear). Sketch a graph that exhibits the qualitative features of a function that has been described verbally.'
                  }
                ]
              }
            ]
          },
          {
            key: 'G',
            desc: 'Geometry',
            clusters: [
              {
                key: 'A',
                desc: 'Solve real-world and mathematical problems involving area, surface area, and volume.',
                standards: [
                  {
                    key: '1',
                    desc: 'Find the area of right triangles, other triangles, special quadrilaterals, and polygons by composing into rectangles or decomposing into triangles and other shapes; apply these techniques in the context of solving real-world and mathematical problems.'
                  },
                  {
                    key: '2',
                    desc: 'Find the volume of right rectangular prisms with fractional edge lengths by packing it with unit cubes of the appropriate unit fraction edge lengths, and show that the volume is the same as would be found by multiplying the edge lengths of the prism. Apply the formulas V = l × w × h and V = b × h for rectangular prisms to find volumes of right rectangular prisms with fractional edge lengths in the context of solving real-world and mathematical problems.'
                  },
                  {
                    key: '3',
                    desc: 'Draw polygons in the coordinate plane given coordinates for the vertices; use coordinates to find the length of a side joining points with the same first coordinate or the same second coordinate. Apply these techniques in the context of solving real-world and mathematical problems.'
                  },
                  {
                    key: '4',
                    desc: 'Represent three-dimensional figures using nets made up of rectangles and triangles, and use the nets to find the surface area of these figures. Apply these techniques in the context of solving real-world and mathematical problems.'
                  }
                ]
              }
            ]
          },
          {
            key: 'SP',
            desc: 'Statistics and Probability',
            clusters: [
              {
                key: 'A',
                desc: 'Develop understanding of statistical variability.',
                standards: [
                  {
                    key: '1',
                    desc: 'Recognize a statistical question as one that anticipates variability in the data related to the question and accounts for it in the answers. For example, “How old am I?” is not a statistical question, but “How old are the students in my school?” is a statistical question because one anticipates variability in students’ ages.'
                  },
                  {
                    key: '2',
                    desc: 'Understand that a set of data collected to answer a statistical question has a distribution which can be described by its center, spread, and overall shape.'
                  },
                  {
                    key: '3',
                    desc: 'Recognize that a measure of center for a numerical data set summarizes all of its values with a single number, while a measure of variation describes how its values vary with a single number.'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Summarize and describe distributions.',
                standards: [
                  {
                    key: '4',
                    desc: 'Display numerical data in plots on a number line, including dot plots, histograms, and box plots.'
                  },
                  {
                    key: '5',
                    desc: 'Summarize numerical data sets in relation to their context, such as by:',
                    subStandards: [
                      {
                        key: '5a',
                        desc: 'Reporting the number of observations.'
                      },
                      {
                        key: '5b',
                        desc: 'Describing the nature of the attribute under investigation, including how it was measured and its units of measurement.'
                      },
                      {
                        key: '5c',
                        desc: 'Giving quantitative measures of center (median and/or mean) and variability (interquartile range and/or mean absolute deviation), as well as describing any overall pattern and any striking deviations from the overall pattern with reference to the context in which the data were gathered.'
                      },
                      {
                        key: '5d',
                        desc: 'Relating the choice of measures of center and variability to the shape of the data distribution and the context in which the data were gathered.'
                      }
                    ]
                  }
                ]
              },
              {
                key: 'C',
                desc: 'Investigate patterns of association in bivariate data.',
                standards: [
                  {
                    key: '6',
                    desc: 'Construct and interpret scatter plots for bivariate measurement data to investigate patterns of association between two quantities. Describe patterns such as clustering, outliers, positive or negative association, linear association, and nonlinear association.'
                  },
                  {
                    key: '7',
                    desc: 'Know that straight lines are widely used to model relationships between two quantitative variables. For scatter plots that suggest a linear association, informally fit a straight line, and informally assess the model fit by judging the closeness of the data points to the line.'
                  },
                  {
                    key: '8',
                    desc: 'Use the equation of a linear model to solve problems in the context of bivariate measurement data, interpreting the slope and intercept. For example, in a linear model for a biology experiment, interpret a slope of 1.5 cm/hr as meaning that an additional hour of sunlight each day is associated with an additional 1.5 cm in mature plant height.'
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
    key: '7',
    desc: '7th',
    domains: [
      {
        key: 'RA',
        desc: 'Ratios and Proportional Relationships',
        clusters: [
          {
            key: 'A',
            desc: 'Analyze proportional relationships and use them to solve real-world and mathematical problems.',
            standards: [
              {
                key: '1',
                desc: 'Compute unit rates associated with ratios of fractions, including ratios of lengths, areas and other quantities measured in like or different units. For example, if a person walks 1/2 mile in each 1/4 hour, compute the unit rate as the complex fraction 1/2 ÷ 1/4 miles per hour, equivalently 2 miles per hour.'
              },
              {
                key: '2',
                desc: 'Recognize and represent proportional relationships between quantities.',
                subStandards: [
                  {
                    key: '2a',
                    desc: 'Decide whether two quantities are in a proportional relationship, e.g., by testing for equivalent ratios in a table or graphing on a coordinate plane and observing whether the graph is a straight line through the origin.'
                  },
                  {
                    key: '2b',
                    desc: 'Identify the constant of proportionality (unit rate) in tables, graphs, equations, diagrams, and verbal descriptions of proportional relationships.'
                  },
                  {
                    key: '2c',
                    desc: 'Represent proportional relationships by equations. For example, if total cost t is proportional to the number n of items purchased at a constant price p, the relationship between the total cost and the number of items can be expressed as t = pn.'
                  },
                  {
                    key: '2d',
                    desc: 'Explain what a point (x, y) on the graph of a proportional relationship means in terms of the situation, with special attention to the points (0, 0) and (1, r) where r is the unit rate.'
                  }
                ]
              },
              {
                key: '3',
                desc: 'Use proportional relationships to solve multistep ratio and percent problems. Examples include simple interest, tax, markups and markdowns, gratuities and commissions, fees, percent increase and decrease, and percent error.'
              }
            ]
          }
        ]
      },
      {
        key: 'NS',
        desc: 'The Number System',
        clusters: [
          {
            key: 'A',
            desc: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.',
            standards: [
              {
                key: '1',
                desc: 'Apply and extend previous understandings of addition and subtraction to add and subtract rational numbers; represent addition and subtraction on a horizontal or vertical number line diagram.'
              },
              {
                key: '2',
                desc: 'Apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers.',
                subStandards: [
                  {
                    key: '2a',
                    desc: 'Understand that multiplication is extended from fractions to rational numbers by requiring that operations continue to satisfy the properties of operations, particularly the distributive property, leading to products such as (–1)(–1) = 1 and the rules for multiplying signed numbers. Interpret products of rational numbers by describing real-world contexts.'
                  },
                  {
                    key: '2b',
                    desc: 'Understand that integers can be divided, provided that the divisor is not zero, and every quotient of integers (with non-zero divisor) is a rational number. If p and q are integers, then –(p/q) = (–p)/q = p/(–q). Interpret quotients of rational numbers by describing real-world contexts.'
                  },
                  {
                    key: '2c',
                    desc: 'Apply properties of operations as strategies to multiply and divide rational numbers.'
                  },
                  {
                    key: '2d',
                    desc: 'Convert a rational number to a decimal using long division; know that the decimal form of a rational number terminates in 0s or eventually repeats.'
                  }
                ]
              },
              {
                key: '3',
                desc: 'Solve real-world and mathematical problems involving the four operations with rational numbers.',
                subStandards: [
                  {
                    key: '3a',
                    desc: 'Solve multi-step real-life and mathematical problems posed with positive and negative rational numbers in any form (whole numbers, fractions, and decimals), using tools strategically. Apply properties of operations to calculate with numbers in any form; convert between forms as appropriate; and assess the reasonableness of answers using mental computation and estimation strategies.'
                  }
                ]
              },
              {
                key: '4',
                desc: 'Use variables to represent quantities in a real-world or mathematical problem, and construct simple equations and inequalities to solve problems.',
                subStandards: [
                  {
                    key: '4a',
                    desc: 'Solve word problems leading to equations of the form px + q = r and p(x + q) = r, where p, q, and r are specific rational numbers. Solve equations of these forms fluently. Compare an algebraic solution to an arithmetic solution, identifying the sequence of the operations used in each approach. For example, the perimeter of a rectangle is 54 cm. Its length is 6 cm. What is its width?'
                  },
                  {
                    key: '4b',
                    desc: 'Solve word problems leading to inequalities of the form px + q > r or px + q < r, where p, q, and r are specific rational numbers. Graph the solution set of the inequality and interpret it in the context of the problem. For example: As a salesperson, you are paid $50 per week plus $3 per sale. This week you want your pay to be at least $100. Write an inequality for the number of sales you need to make, and describe the solutions.'
                  },
                  {
                    key: '4c',
                    desc: 'Solve real-life and mathematical problems involving angle measure, area, surface area, and volume.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        key: 'EE',
        desc: 'Expressions and Equations',
        clusters: [
          {
            key: 'A',
            desc: 'Use properties of operations to generate equivalent expressions.',
            standards: [
              {
                key: '1',
                desc: 'Apply properties of operations as strategies to add, subtract, factor, and expand linear expressions with rational coefficients.'
              },
              {
                key: '2',
                desc: 'Understand that rewriting an expression in different forms in a problem context can shed light on the problem and how the quantities in it are related. For example, a + 0.05a = 1.05a means that “increase by 5%” is the same as “multiply by 1.05.”'
              },
              {
                key: '3',
                desc: 'Solve real-life and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q, and x are all nonnegative rational numbers.'
              },
              {
                key: '4',
                desc: 'Write an inequality of the form x > c or x < c to represent a constraint or condition in a real-world or mathematical problem. Recognize that inequalities of the form x > c or x < c have infinitely many solutions; represent solutions of such inequalities on number line diagrams.'
              },
              {
                key: '5',
                desc: 'Use variables to represent two quantities in a real-world or mathematical problem that change in relationship to one another; write an equation to express one quantity, thought of as the dependent variable, in terms of the other quantity, thought of as the independent variable. Analyze the relationship between the dependent and independent variables using graphs and tables, and relate these to the equation. For example, in a problem involving motion at constant speed, list and graph ordered pairs of distances and times, and write the equation d = 65t to represent the relationship between distance and time.'
              }
            ]
          }
        ]
      },
      {
        key: 'G',
        desc: 'Geometry',
        clusters: [
          {
            key: 'A',
            desc: 'Solve real-world and mathematical problems involving area, surface area, and volume.',
            standards: [
              {
                key: '1',
                desc: 'Find the area of right triangles, other triangles, special quadrilaterals, and polygons by composing into rectangles or decomposing into triangles and other shapes; apply these techniques in the context of solving real-world and mathematical problems.'
              },
              {
                key: '2',
                desc: 'Find the volume of right rectangular prisms with fractional edge lengths by packing it with unit cubes of the appropriate unit fraction edge lengths, and show that the volume is the same as would be found by multiplying the edge lengths of the prism. Apply the formulas V = l × w × h and V = b × h for rectangular prisms to find volumes of right rectangular prisms with fractional edge lengths in the context of solving real-world and mathematical problems.'
              },
              {
                key: '3',
                desc: 'Draw polygons in the coordinate plane given coordinates for the vertices; use coordinates to find the length of a side joining points with the same first coordinate or the same second coordinate. Apply these techniques in the context of solving real-world and mathematical problems.'
              },
              {
                key: '4',
                desc: 'Represent three-dimensional figures using nets made up of rectangles and triangles, and use the nets to find the surface area of these figures. Apply these techniques in the context of solving real-world and mathematical problems.'
              }
            ]
          }
        ]
      },
      {
        key: 'SP',
        desc: 'Statistics and Probability',
        clusters: [
          {
            key: 'A',
            desc: 'Develop understanding of statistical variability.',
            standards: [
              {
                key: '1',
                desc: 'Recognize a statistical question as one that anticipates variability in the data related to the question and accounts for it in the answers. For example, “How old am I?” is not a statistical question, but “How old are the students in my school?” is a statistical question because one anticipates variability in students’ ages.'
              },
              {
                key: '2',
                desc: 'Understand that a set of data collected to answer a statistical question has a distribution which can be described by its center, spread, and overall shape.'
              },
              {
                key: '3',
                desc: 'Recognize that a measure of center for a numerical data set summarizes all of its values with a single number, while a measure of variation describes how its values vary with a single number.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Summarize and describe distributions.',
            standards: [
              {
                key: '4',
                desc: 'Display numerical data in plots on a number line, including dot plots, histograms, and box plots.'
              },
              {
                key: '5',
                desc: 'Summarize numerical data sets in relation to their context, such as by:',
                subStandards: [
                  {
                    key: '5a',
                    desc: 'Reporting the number of observations.'
                  },
                  {
                    key: '5b',
                    desc: 'Describing the nature of the attribute under investigation, including how it was measured and its units of measurement.'
                  },
                  {
                    key: '5c',
                    desc: 'Giving quantitative measures of center (median and/or mean) and variability (interquartile range and/or mean absolute deviation), as well as describing any overall pattern and any striking deviations from the overall pattern with reference to the context in which the data were gathered.'
                  },
                  {
                    key: '5d',
                    desc: 'Relating the choice of measures of center and variability to the shape of the data distribution and the context in which the data were gathered.'
                  }
                ]
              }
            ]
          },
          {
            key: 'C',
            desc: 'Investigate chance processes and develop, use, and evaluate probability models.',
            standards: [
              {
                key: '6',
                desc: 'Approximate the probability of a chance event by collecting data on the chance process that produces it and observing its long-run relative frequency, and predict the approximate relative frequency given the probability. For example, when rolling a number cube 600 times, predict that a 3 or 6 would be rolled roughly 200 times, but probably not exactly 200 times.'
              },
              {
                key: '7',
                desc: 'Develop a probability model and use it to find probabilities of events. Compare probabilities from a model to observed frequencies; if the agreement is not good, explain possible sources of the discrepancy.',
                subStandards: [
                  {
                    key: '7a',
                    desc: 'Develop a uniform probability model by assigning equal probability to all outcomes, and use the model to determine probabilities of events. For example, if a student is selected at random from a class, find the probability that Jane will be selected and the probability that a girl will be selected.'
                  },
                  {
                    key: '7b',
                    desc: 'Develop a probability model (which may not be uniform) by observing frequencies in data generated from a chance process. For example, find the approximate probability that a spinning penny will land heads up or that a tossed paper cup will land open-end down. Do the outcomes for the spinning penny appear to be equally likely based on the observed frequencies?'
                  }
                ]
              },
              {
                key: '8',
                desc: 'Find probabilities of compound events using organized lists, tables, tree diagrams, and simulation.',
                subStandards: [
                  {
                    key: '8a',
                    desc: 'Understand that, just as with simple events, the probability of a compound event is the fraction of outcomes in the sample space for which the compound event occurs.'
                  },
                  {
                    key: '8b',
                    desc: 'Represent sample spaces for compound events using methods such as organized lists, tables and tree diagrams. For an event described in everyday language (e.g., “rolling double sixes”), identify the outcomes in the sample space which compose the event.'
                  },
                  {
                    key: '8c',
                    desc: 'Design and use a simulation to generate frequencies for compound events. For example, use random digits as a simulation tool to approximate the answer to the question: If 40% of donors have type A blood, what is the probability that it will take at least 4 donors to find one with type A blood?'
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
    key: '6',
    desc: '6th',
    domains: [
      {
        key: 'RA',
        desc: 'Ratios and Proportional Relationships',
        clusters: [
          {
            key: 'A',
            desc: 'Understand ratio concepts and use ratio reasoning to solve problems.',
            standards: [
              {
                key: '1',
                desc: 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities. For example, “The ratio of wings to beaks in the bird house at the zoo was 2:1, because for every 2 wings there was 1 beak.” “For every vote candidate A received, candidate C received nearly three votes.”'
              },
              {
                key: '2',
                desc: 'Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship. For example, “This recipe has a ratio of 3 cups of flour to 4 cups of sugar, so there is 3/4 cup of flour for each cup of sugar.” “We paid $75 for 15 hamburgers, which is a rate of $5 per hamburger.”'
              },
              {
                key: '3',
                desc: 'Use ratio and rate reasoning to solve real-world and mathematical problems, e.g., by reasoning about tables of equivalent ratios, tape diagrams, double number line diagrams, or equations.',
                subStandards: [
                  {
                    key: '3a',
                    desc: 'Make tables of equivalent ratios relating quantities with whole-number measurements, find missing values in the tables, and plot the pairs of values on the coordinate plane. Use tables to compare ratios.'
                  },
                  {
                    key: '3b',
                    desc: 'Solve unit rate problems including those involving unit pricing and constant speed. For example, if it took 7 hours to mow 4 lawns, then at that rate, how many lawns could be mowed in 35 hours? At what rate were lawns being mowed?'
                  },
                  {
                    key: '3c',
                    desc: 'Find a percent of a quantity as a rate per 100 (e.g., 30% of a quantity means 30/100 times the quantity); solve problems involving finding the whole, given a part and the percent.'
                  },
                  {
                    key: '3d',
                    desc: 'Use ratio reasoning to convert measurement units; manipulate and transform units appropriately when multiplying or dividing quantities.'
                  }
                ]
              }
            ]
          },
          {
            key: 'B',
            desc: 'The Number System',
            standards: [
              {
                key: '1',
                desc: 'Understand that a rational number is a point on the number line. Extend number line diagrams and coordinate axes familiar from previous grades to represent points on the line and in the plane with negative number coordinates.'
              },
              {
                key: '2',
                desc: 'Understand ordering and absolute value of rational numbers.',
                subStandards: [
                  {
                    key: '2a',
                    desc: 'Interpret statements of inequality as statements about the relative position of two numbers on a number line diagram. For example, interpret –3 > –7 as a statement that –3 is located to the right of –7 on a number line oriented from left to right.'
                  },
                  {
                    key: '2b',
                    desc: 'Write, interpret, and explain statements of order for rational numbers in real-world contexts. For example, write –3°C > –7°C to express the fact that –3°C is warmer than –7°C.'
                  },
                  {
                    key: '2c',
                    desc: 'Understand the absolute value of a rational number as its distance from 0 on the number line; interpret absolute value as magnitude for a positive or negative quantity in a real-world situation. For example, for an account balance of –30 dollars, write |–30| = 30 to describe the size of the debt in dollars.'
                  },
                  {
                    key: '2d',
                    desc: 'Distinguish comparisons of absolute value from statements about order. For example, recognize that an account balance less than –30 dollars represents a debt greater than 30 dollars.'
                  }
                ]
              },
              {
                key: '3',
                desc: 'Apply and extend previous understandings of numbers to the system of rational numbers.',
                subStandards: [
                  {
                    key: '3a',
                    desc: 'Understand that positive and negative numbers are used together to describe quantities having opposite directions or values (e.g., temperature above/below zero, elevation above/below sea level, credits/debits, positive/negative electric charge); use positive and negative numbers to represent quantities in real-world contexts, explaining the meaning of 0 in each situation.'
                  },
                  {
                    key: '3b',
                    desc: 'Find and position integers and other rational numbers on a horizontal or vertical number line diagram; find and position pairs of integers and other rational numbers on a coordinate plane.'
                  }
                ]
              },
              {
                key: '4',
                desc: 'Express and analyze quantitative relationships between dependent and independent variables.',
                standards: [
                  {
                    key: '4a',
                    desc: 'Use variables to represent two quantities in a real-world problem that change in relationship to one another; write an equation to express one quantity, thought of as the dependent variable, in terms of the other quantity, thought of as the independent variable.'
                  },
                  {
                    key: '4b',
                    desc: 'Analyze the relationship between the dependent and independent variables using graphs and tables, and relate these to the equation. For example, in a problem involving motion at constant speed, list and graph ordered pairs of distances and times, and write the equation d = 65t to represent the relationship between distance and time.'
                  }
                ]
              }
            ]
          },
          {
            key: 'EE',
            desc: 'Expressions and Equations',
            clusters: [
              {
                key: 'A',
                desc: 'Apply and extend previous understandings of arithmetic to algebraic expressions.',
                standards: [
                  {
                    key: '1',
                    desc: 'Write and evaluate numerical expressions involving whole-number exponents.'
                  },
                  {
                    key: '2',
                    desc: 'Write, read, and evaluate expressions in which letters stand for numbers.',
                    subStandards: [
                      {
                        key: '2a',
                        desc: 'Write expressions that record operations with numbers and with letters standing for numbers. For example, express the calculation “Subtract y from 5” as 5 – y.'
                      },
                      {
                        key: '2b',
                        desc: 'Identify parts of an expression using mathematical terms (sum, term, product, factor, quotient, coefficient); view one or more parts of an expression as a single entity. For example, describe the expression 2 (8 + 7) as a product of two factors; view (8 + 7) as both a single entity and a sum of two terms.'
                      },
                      {
                        key: '2c',
                        desc: 'Evaluate expressions at specific values of their variables. Include expressions that arise from formulas used in real-world problems. Perform arithmetic operations, including those involving whole-number exponents, in the conventional order when there are no parentheses to specify a particular order (Order of Operations). For example, use the formulas V = s³ and A = 6 s² to find the volume and surface area of a cube with sides of length s = 1/2.'
                      }
                    ]
                  },
                  {
                    key: '3',
                    desc: 'Apply the properties of operations to generate equivalent expressions.',
                    descExtended: 'For example, apply the distributive property to the expression 3 (2 + x) to produce the equivalent expression 6 + 3x; apply the distributive property to the expression 24x + 18y to produce the equivalent expression 6 (4x + 3y); apply properties of operations to y + y + y to produce the equivalent expression 3y.'
                  },
                  {
                    key: '4',
                    desc: 'Identify when two expressions are equivalent (i.e., when the two expressions name the same number regardless of which value is substituted into them). For example, the expressions y + y + y and 3y are equivalent because they name the same number regardless of which number y stands for.'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Reason about and solve one-variable equations and inequalities.',
                standards: [
                  {
                    key: '5',
                    desc: 'Understand solving an equation or inequality as a process of answering a question: which values from a specified set, if any, make the equation or inequality true? Use substitution to determine whether a given number in a specified set makes an equation or inequality true.'
                  },
                  {
                    key: '6',
                    desc: 'Use variables to represent numbers and write expressions when solving a real-world or mathematical problem; understand that a variable can represent an unknown number, or, depending on the purpose at hand, any number in a specified set.'
                  },
                  {
                    key: '7',
                    desc: 'Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q, and x are all nonnegative rational numbers.'
                  },
                  {
                    key: '8',
                    desc: 'Write an inequality of the form x > c or x < c to represent a constraint or condition in a real-world or mathematical problem. Recognize that inequalities of the form x > c or x < c have infinitely many solutions; represent solutions of such inequalities on number line diagrams.'
                  },
                  {
                    key: '9',
                    desc: 'Use variables to represent two quantities in a real-world problem that change in relationship to one another; write an equation to express one quantity, thought of as the dependent variable, in terms of the other quantity, thought of as the independent variable. Analyze the relationship between the dependent and independent variables using graphs and tables, and relate these to the equation. For example, in a problem involving motion at constant speed, list and graph ordered pairs of distances and times, and write the equation d = 65t to represent the relationship between distance and time.'
                  }
                ]
              }
            ]
          },
          {
            key: 'G',
            desc: 'Geometry',
            clusters: [
              {
                key: 'A',
                desc: 'Solve real-world and mathematical problems involving area, surface area, and volume.',
                standards: [
                  {
                    key: '1',
                    desc: 'Find the area of right triangles, other triangles, special quadrilaterals, and polygons by composing into rectangles or decomposing into triangles and other shapes; apply these techniques in the context of solving real-world and mathematical problems.'
                  },
                  {
                    key: '2',
                    desc: 'Find the volume of right rectangular prisms with fractional edge lengths by packing it with unit cubes of the appropriate unit fraction edge lengths, and show that the volume is the same as would be found by multiplying the edge lengths of the prism. Apply the formulas V = l × w × h and V = b × h for rectangular prisms to find volumes of right rectangular prisms with fractional edge lengths in the context of solving real-world and mathematical problems.'
                  },
                  {
                    key: '3',
                    desc: 'Draw polygons in the coordinate plane given coordinates for the vertices; use coordinates to find the length of a side joining points with the same first coordinate or the same second coordinate. Apply these techniques in the context of solving real-world and mathematical problems.'
                  },
                  {
                    key: '4',
                    desc: 'Represent three-dimensional figures using nets made up of rectangles and triangles, and use the nets to find the surface area of these figures. Apply these techniques in the context of solving real-world and mathematical problems.'
                  }
                ]
              }
            ]
          },
          {
            key: 'SP',
            desc: 'Statistics and Probability',
            clusters: [
              {
                key: 'A',
                desc: 'Develop understanding of statistical variability.',
                standards: [
                  {
                    key: '1',
                    desc: 'Recognize a statistical question as one that anticipates variability in the data related to the question and accounts for it in the answers. For example, “How old am I?” is not a statistical question, but “How old are the students in my school?” is a statistical question because one anticipates variability in students’ ages.'
                  },
                  {
                    key: '2',
                    desc: 'Understand that a set of data collected to answer a statistical question has a distribution which can be described by its center, spread, and overall shape.'
                  },
                  {
                    key: '3',
                    desc: 'Recognize that a measure of center for a numerical data set summarizes all of its values with a single number, while a measure of variation describes how its values vary with a single number.'
                  }
                ]
              },
              {
                key: 'B',
                desc: 'Summarize and describe distributions.',
                standards: [
                  {
                    key: '4',
                    desc: 'Display numerical data in plots on a number line, including dot plots, histograms, and box plots.'
                  },
                  {
                    key: '5',
                    desc: 'Summarize numerical data sets in relation to their context, such as by:',
                    subStandards: [
                      {
                        key: '5a',
                        desc: 'Reporting the number of observations.'
                      },
                      {
                        key: '5b',
                        desc: 'Describing the nature of the attribute under investigation, including how it was measured and its units of measurement.'
                      },
                      {
                        key: '5c',
                        desc: 'Giving quantitative measures of center (median and/or mean) and variability (interquartile range and/or mean absolute deviation), as well as describing any overall pattern and any striking deviations from the overall pattern with reference to the context in which the data were gathered.'
                      },
                      {
                        key: '5d',
                        desc: 'Relating the choice of measures of center and variability to the shape of the data distribution and the context in which the data were gathered.'
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
        key: 'NS',
        desc: 'The Number System',
        clusters: [
          {
            key: 'A',
            desc: 'Understand the place value system.',
            standards: [
              {
                key: '1',
                desc: 'Recognize that in a multi-digit number, a digit in one place represents 10 times as much as it represents in the place to its right and 1/10 of what it represents in the place to its left.'
              },
              {
                key: '2',
                desc: 'Explain patterns in the number of zeros of the product when multiplying a number by powers of 10, and explain patterns in the placement of the decimal point when a decimal is multiplied or divided by a power of 10. Use whole-number exponents to denote powers of 10.'
              },
              {
                key: '3',
                desc: 'Read, write, and compare decimals to thousandths.',
                subStandards: [
                  {
                    key: '3a',
                    desc: 'Read and write decimals to thousandths using base-ten numerals, number names, and expanded form, e.g., 347.392 = 3 × 100 + 4 × 10 + 7 × 1 + 3 × (1/10) + 9 × (1/100) + 2 × (1/1000).'
                  },
                  {
                    key: '3b',
                    desc: 'Compare two decimals to thousandths based on meanings of the digits in each place, using >, =, and < symbols to record the results of comparisons.'
                  }
                ]
              },
              {
                key: '4',
                desc: 'Use place value understanding to round decimals to any place.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Perform operations with multi-digit whole numbers and with decimals to hundredths.',
            standards: [
              {
                key: '5',
                desc: 'Fluently multiply multi-digit whole numbers using the standard algorithm.'
              },
              {
                key: '6',
                desc: 'Find whole-number quotients of whole numbers with up to four-digit dividends and two-digit divisors, using strategies based on place value, the properties of operations, and/or the relationship between multiplication and division. Illustrate and explain the calculation by using equations, rectangular arrays, and/or area models.'
              },
              {
                key: '7',
                desc: 'Add, subtract, multiply, and divide decimals to hundredths, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used.'
              }
            ]
          }
        ]
      },
      {
        key: 'NF',
        desc: 'Number & Operations—Fractions',
        clusters: [
          {
            key: 'A',
            desc: 'Use equivalent fractions as a strategy to add and subtract fractions.',
            standards: [
              {
                key: '1',
                desc: 'Add and subtract fractions with unlike denominators (including mixed numbers) by replacing given fractions with equivalent fractions in such a way as to produce an equivalent sum or difference of fractions with like denominators. For example, 2/3 + 5/4 = 8/12 + 15/12 = 23/12. (In general, a/b + c/d = (ad + bc)/bd.)'
              },
              {
                key: '2',
                desc: 'Solve word problems involving addition and subtraction of fractions referring to the same whole, including cases of unlike denominators, e.g., by using visual fraction models or equations to represent the problem. Use benchmark fractions and number sense of fractions to estimate mentally and assess the reasonableness of answers. For example, recognize an incorrect result 2/5 + 1/2 = 3/7, by observing that 3/7 < 1/2.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.',
            standards: [
              {
                key: '3',
                desc: 'Interpret a fraction as division of the numerator by the denominator (a/b = a ÷ b). Solve word problems involving division of whole numbers leading to answers in the form of fractions or mixed numbers, e.g., by using visual fraction models or equations to represent the problem. For example, create a story context for (2/3) ÷ (3/4) and use a visual fraction model to show the quotient; use the relationship between multiplication and division to explain that (2/3) ÷ (3/4) = 8/9 because 3/4 of 8/9 is 2/3. (In general, (a/b) ÷ (c/d) = ad/bc.) How much chocolate will each person get if 3 people share 1/2 lb of chocolate equally? How many 1/3-cup servings are in 2/3 of a cup of yogurt? How wide is a rectangular strip of land with length 3/4 mi and area 1/2 square mi?'
              },
              {
                key: '4',
                desc: 'Apply and extend previous understandings of multiplication to multiply and divide fractions.',
                subStandards: [
                  {
                    key: '4a',
                    desc: 'Understand a fraction a/b as a multiple of 1/b. For example, use a visual fraction model to represent 5/4 as the product 5 × (1/4), recording the conclusion by the equation 5/4 = 5 × (1/4).'
                  },
                  {
                    key: '4b',
                    desc: 'Understand a multiple of a/b as a multiple of 1/b, and use this understanding to multiply a fraction by a whole number. For example, use a visual fraction model to express 3 × (2/5) as 6 × (1/5), recognizing this product as 6/5. (In general, n × (a/b) = (n × a)/b.)'
                  },
                  {
                    key: '4c',
                    desc: 'Solve word problems involving multiplication of a fraction by a whole number, e.g., by using visual fraction models or equations to represent the problem. For example, if each person at a party will eat 3/8 of a pound of roast beef, and there will be 5 people at the party, how many pounds of roast beef will be needed? Between what two whole numbers does your answer lie?'
                  }
                ]
              },
              {
                key: '5',
                desc: 'Interpret multiplication as scaling (resizing), by:',
                subStandards: [
                  {
                    key: '5a',
                    desc: 'Comparing the size of a product to the size of one factor on the basis of the size of the other factor, without performing the indicated multiplication.'
                  },
                  {
                    key: '5b',
                    desc: 'Explaining why multiplying a given number by a fraction greater than 1 results in a product greater than the given number (recognizing multiplication by whole numbers greater than 1 as a familiar case); explaining why multiplying a given number by a fraction less than 1 results in a product smaller than the given number; and relating the principle of fraction equivalence a/b = (n×a)/(n×b) to the effect of multiplying a/b by 1.'
                  }
                ]
              },
              {
                key: '6',
                desc: 'Solve real-world problems involving multiplication of fractions and mixed numbers, e.g., by using visual fraction models or equations to represent the problem.'
              },
              {
                key: '7',
                desc: 'Apply and extend previous understandings of division to divide unit fractions by whole numbers and whole numbers by unit fractions.',
                subStandards: [
                  {
                    key: '7a',
                    desc: 'Interpret division of a unit fraction by a non-zero whole number, and compute such quotients. For example, create a story context for (1/3) ÷ 4, and use a visual fraction model to show the quotient. Use the relationship between multiplication and division to explain that (1/3) ÷ 4 = 1/12 because (1/12) × 4 = 1/3.'
                  },
                  {
                    key: '7b',
                    desc: 'Interpret division of a whole number by a unit fraction, and compute such quotients. For example, create a story context for 4 ÷ (1/5), and use a visual fraction model to show the quotient. Use the relationship between multiplication and division to explain that 4 ÷ (1/5) = 20 because 20 × (1/5) = 4.'
                  },
                  {
                    key: '7c',
                    desc: 'Solve real-world problems involving division of unit fractions by non-zero whole numbers and division of whole numbers by unit fractions, e.g., by using visual fraction models and equations to represent the problem. For example, how much chocolate will each person get if 3 people share 1/2 lb of chocolate equally? How many 1/3-cup servings are in 2 cups of raisins?'
                  }
                ]
              }
            ]
          },
          {
            key: 'C',
            desc: 'Understand decimal notation for fractions, and compare decimal fractions.',
            standards: [
              {
                key: '5',
                desc: 'Express a fraction with denominator 10 as an equivalent fraction with denominator 100, and use this technique to add two fractions with respective denominators 10 and 100. For example, express 3/10 as 30/100, and add 3/10 + 4/100 = 34/100.'
              },
              {
                key: '6',
                desc: 'Use decimal notation for fractions with denominators 10 or 100. For example, rewrite 0.62 as 62/100; describe a length as 0.62 meters; locate 0.62 on a number line diagram.'
              },
              {
                key: '7',
                desc: 'Compare two decimals to hundredths by reasoning about their size. Recognize that comparisons are valid only when the two decimals refer to the same whole. Record the results of comparisons with the symbols >, =, or <, and justify the conclusions, e.g., by using a visual model.'
              }
            ]
          }
        ]
      },
      {
        key: 'NS',
        desc: 'The Number System',
        clusters: [
          {
            key: 'A',
            desc: 'Understand the place value system.',
            standards: [
              {
                key: '1',
                desc: 'Recognize that in a multi-digit number, a digit in one place represents 10 times as much as it represents in the place to its right and 1/10 of what it represents in the place to its left.'
              },
              {
                key: '2',
                desc: 'Explain patterns in the number of zeros of the product when multiplying a number by powers of 10, and explain patterns in the placement of the decimal point when a decimal is multiplied or divided by a power of 10. Use whole-number exponents to denote powers of 10.'
              },
              {
                key: '3',
                desc: 'Read, write, and compare decimals to thousandths.',
                subStandards: [
                  {
                    key: '3a',
                    desc: 'Read and write decimals to thousandths using base-ten numerals, number names, and expanded form, e.g., 347.392 = 3 × 100 + 4 × 10 + 7 × 1 + 3 × (1/10) + 9 × (1/100) + 2 × (1/1000).'
                  },
                  {
                    key: '3b',
                    desc: 'Compare two decimals to thousandths based on meanings of the digits in each place, using >, =, and < symbols to record the results of comparisons.'
                  }
                ]
              },
              {
                key: '4',
                desc: 'Use place value understanding to round decimals to any place.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Perform operations with multi-digit whole numbers and with decimals to hundredths.',
            standards: [
              {
                key: '5',
                desc: 'Fluently multiply multi-digit whole numbers using the standard algorithm.'
              },
              {
                key: '6',
                desc: 'Find whole-number quotients of whole numbers with up to four-digit dividends and two-digit divisors, using strategies based on place value, the properties of operations, and/or the relationship between multiplication and division. Illustrate and explain the calculation by using equations, rectangular arrays, and/or area models.'
              },
              {
                key: '7',
                desc: 'Add, subtract, multiply, and divide decimals to hundredths, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used.'
              }
            ]
          }
        ]
      },
      {
        key: 'SP',
        desc: 'Statistics and Probability',
        clusters: [
          {
            key: 'A',
            desc: 'Develop understanding of statistical variability.',
            standards: [
              {
                key: '1',
                desc: 'Recognize a statistical question as one that anticipates variability in the data related to the question and accounts for it in the answers. For example, “How old am I?” is not a statistical question, but “How old are the students in my school?” is a statistical question because one anticipates variability in students’ ages.'
              },
              {
                key: '2',
                desc: 'Understand that a set of data collected to answer a statistical question has a distribution which can be described by its center, spread, and overall shape.'
              },
              {
                key: '3',
                desc: 'Recognize that a measure of center for a numerical data set summarizes all of its values with a single number, while a measure of variation describes how its values vary with a single number.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Summarize and describe distributions.',
            standards: [
              {
                key: '4',
                desc: 'Display numerical data in plots on a number line, including dot plots, histograms, and box plots.'
              },
              {
                key: '5',
                desc: 'Summarize numerical data sets in relation to their context, such as by:',
                subStandards: [
                  {
                    key: '5a',
                    desc: 'Reporting the number of observations.'
                  },
                  {
                    key: '5b',
                    desc: 'Describing the nature of the attribute under investigation, including how it was measured and its units of measurement.'
                  },
                  {
                    key: '5c',
                    desc: 'Giving quantitative measures of center (median and/or mean) and variability (interquartile range and/or mean absolute deviation), as well as describing any overall pattern and any striking deviations from the overall pattern with reference to the context in which the data were gathered.'
                  },
                  {
                    key: '5d',
                    desc: 'Relating the choice of measures of center and variability to the shape of the data distribution and the context in which the data were gathered.'
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
    key: '5',
    desc: '5th',
    domains: [
      {
        key: 'OA',
        desc: 'Operations & Algebraic Thinking',
        clusters: [
          {
            key: 'A',
            desc: 'Write and interpret numerical expressions.',
            standards: [
              {
                key: '1',
                desc: 'Use parentheses, brackets, or braces in numerical expressions, and evaluate expressions with these symbols.'
              },
              {
                key: '2',
                desc: 'Write simple expressions that record calculations with numbers, and interpret numerical expressions without evaluating them. For example, express the calculation “add 8 and 7, then multiply by 2” as 2 × (8 + 7). Recognize that 3 × (18932 + 921) is three times as large as 18932 + 921, without having to calculate the indicated sum or product.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Analyze patterns and relationships.',
            standards: [
              {
                key: '3',
                desc: 'Generate patterns and relationships. Generate two numerical patterns using two given rules. Identify apparent relationships between corresponding terms. Form ordered pairs consisting of corresponding terms from the two patterns, and graph the ordered pairs on a coordinate plane. For example, given the rule “Add 3” and the starting number 0, and given the rule “Add 6” and the starting number 0, generate terms in the resulting sequences, and observe that the terms in one sequence are twice the corresponding terms in the other sequence. Explain informally why this is so.'
              }
            ]
          }
        ]
      },
      {
        key: 'NBT',
        desc: 'Number & Operations in Base Ten',
        clusters: [
          {
            key: 'A',
            desc: 'Understand the place value system.',
            standards: [
              {
                key: '1',
                desc: 'Recognize that in a multi-digit number, a digit in one place represents 10 times as much as it represents in the place to its right and 1/10 of what it represents in the place to its left.'
              },
              {
                key: '2',
                desc: 'Explain patterns in the number of zeros of the product when multiplying a number by powers of 10, and explain patterns in the placement of the decimal point when a decimal is multiplied or divided by a power of 10. Use whole-number exponents to denote powers of 10.'
              },
              {
                key: '3',
                desc: 'Read, write, and compare decimals to thousandths.',
                subStandards: [
                  {
                    key: '3a',
                    desc: 'Read and write decimals to thousandths using base-ten numerals, number names, and expanded form, e.g., 347.392 = 3 × 100 + 4 × 10 + 7 × 1 + 3 × (1/10) + 9 × (1/100) + 2 × (1/1000).'
                  },
                  {
                    key: '3b',
                    desc: 'Compare two decimals to thousandths based on meanings of the digits in each place, using >, =, and < symbols to record the results of comparisons.'
                  }
                ]
              },
              {
                key: '4',
                desc: 'Use place value understanding to round decimals to any place.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Perform operations with multi-digit whole numbers and with decimals to hundredths.',
            standards: [
              {
                key: '5',
                desc: 'Fluently multiply multi-digit whole numbers using the standard algorithm.'
              },
              {
                key: '6',
                desc: 'Find whole-number quotients of whole numbers with up to four-digit dividends and two-digit divisors, using strategies based on place value, the properties of operations, and/or the relationship between multiplication and division. Illustrate and explain the calculation by using equations, rectangular arrays, and/or area models.'
              },
              {
                key: '7',
                desc: 'Add, subtract, multiply, and divide decimals to hundredths, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used.'
              }
            ]
          }
        ]
      },
      {
        key: 'NF',
        desc: 'Number & Operations—Fractions',
        clusters: [
          {
            key: 'A',
            desc: 'Use equivalent fractions as a strategy to add and subtract fractions.',
            standards: [
              {
                key: '1',
                desc: 'Add and subtract fractions with unlike denominators (including mixed numbers) by replacing given fractions with equivalent fractions in such a way as to produce an equivalent sum or difference of fractions with like denominators. For example, 2/3 + 5/4 = 8/12 + 15/12 = 23/12. (In general, a/b + c/d = (ad + bc)/bd.)'
              },
              {
                key: '2',
                desc: 'Solve word problems involving addition and subtraction of fractions referring to the same whole, including cases of unlike denominators, e.g., by using visual fraction models or equations to represent the problem. Use benchmark fractions and number sense of fractions to estimate mentally and assess the reasonableness of answers. For example, recognize an incorrect result 2/5 + 1/2 = 3/7, by observing that 3/7 < 1/2.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.',
            standards: [
              {
                key: '3',
                desc: 'Interpret a fraction as division of the numerator by the denominator (a/b = a ÷ b). Solve word problems involving division of whole numbers leading to answers in the form of fractions or mixed numbers, e.g., by using visual fraction models or equations to represent the problem. For example, interpret 3/4 as the result of dividing 3 by 4, noting that 3/4 multiplied by 4 equals 3, and that when 3 wholes are shared equally among 4 people each person has a share of size 3/4. If 9 people want to share a 50-pound sack of rice equally by weight, how many pounds of rice should each person get? Between what two whole numbers does your answer lie?'
              },
              {
                key: '4',
                desc: 'Apply and extend previous understandings of multiplication to multiply and divide fractions.',
                subStandards: [
                  {
                    key: '4a',
                    desc: 'Understand a fraction a/b as a multiple of 1/b. For example, use a visual fraction model to represent 5/4 as the product 5 × (1/4), recording the conclusion by the equation 5/4 = 5 × (1/4).'
                  },
                  {
                    key: '4b',
                    desc: 'Understand a multiple of a/b as a multiple of 1/b, and use this understanding to multiply a fraction by a whole number. For example, use a visual fraction model to express 3 × (2/5) as 6 × (1/5), recognizing this product as 6/5. (In general, n × (a/b) = (n × a)/b.)'
                  },
                  {
                    key: '4c',
                    desc: 'Solve word problems involving multiplication of a fraction by a whole number, e.g., by using visual fraction models or equations to represent the problem. For example, if each person at a party will eat 3/8 of a pound of roast beef, and there will be 5 people at the party, how many pounds of roast beef will be needed? Between what two whole numbers does your answer lie?'
                  }
                ]
              },
              {
                key: '5',
                desc: 'Interpret multiplication as scaling (resizing), by:',
                subStandards: [
                  {
                    key: '5a',
                    desc: 'Comparing the size of a product to the size of one factor on the basis of the size of the other factor, without performing the indicated multiplication.'
                  },
                  {
                    key: '5b',
                    desc: 'Explaining why multiplying a given number by a fraction greater than 1 results in a product greater than the given number (recognizing multiplication by whole numbers greater than 1 as a familiar case); explaining why multiplying a given number by a fraction less than 1 results in a product smaller than the given number; and relating the principle of fraction equivalence a/b = (n×a)/(n×b) to the effect of multiplying a/b by 1.'
                  }
                ]
              },
              {
                key: '6',
                desc: 'Solve real world problems involving multiplication of fractions and mixed numbers, e.g., by using visual fraction models or equations to represent the problem.'
              },
              {
                key: '7',
                desc: 'Apply and extend previous understandings of division to divide unit fractions by whole numbers and whole numbers by unit fractions.',
                subStandards: [
                  {
                    key: '7a',
                    desc: 'Interpret division of a unit fraction by a non-zero whole number, and compute such quotients. For example, create a story context for (1/3) ÷ 4, and use a visual fraction model to show the quotient. Use the relationship between multiplication and division to explain that (1/3) ÷ 4 = 1/12 because (1/12) × 4 = 1/3.'
                  },
                  {
                    key: '7b',
                    desc: 'Interpret division of a whole number by a unit fraction, and compute such quotients. For example, create a story context for 4 ÷ (1/5), and use a visual fraction model to show the quotient. Use the relationship between multiplication and division to explain that 4 ÷ (1/5) = 20 because 20 × (1/5) = 4.'
                  },
                  {
                    key: '7c',
                    desc: 'Solve real world problems involving division of unit fractions by non-zero whole numbers and division of whole numbers by unit fractions, e.g., by using visual fraction models and equations to represent the problem. For example, how much chocolate will each person get if 3 people share 1/2 lb of chocolate equally? How many 1/3-cup servings are in 2 cups of raisins?'
                  }
                ]
              }
            ]
          },
          {
            key: 'C',
            desc: 'Understand decimal notation for fractions, and compare decimal fractions.',
            standards: [
              {
                key: '5',
                desc: 'Express a fraction with denominator 10 as an equivalent fraction with denominator 100, and use this technique to add two fractions with respective denominators 10 and 100. For example, express 3/10 as 30/100, and add 3/10 + 4/100 = 34/100.'
              },
              {
                key: '6',
                desc: 'Use decimal notation for fractions with denominators 10 or 100. For example, rewrite 0.62 as 62/100; describe a length as 0.62 meters; locate 0.62 on a number line diagram.'
              },
              {
                key: '7',
                desc: 'Compare two decimals to hundredths by reasoning about their size. Recognize that comparisons are valid only when the two decimals refer to the same whole. Record the results of comparisons with the symbols >, =, or <, and justify the conclusions, e.g., by using a visual model.'
              }
            ]
          }
        ]
      },
      {
        key: 'MD',
        desc: 'Measurement & Data',
        clusters: [
          {
            key: 'A',
            desc: 'Solve problems involving measurement and conversion of measurements from a larger unit to a smaller unit.',
            standards: [
              {
                key: '1',
                desc: 'Convert like measurement units within a given measurement system. Convert among different-sized standard measurement units within a given measurement system (e.g., convert 5 cm to 0.05 m), and use these conversions in solving multi-step, real world problems. Record measurement equivalents in a two-column table. For example, know that 1 ft is 12 times as long as 1 in. Express the length of a 4 ft snake as 48 in. Generate a conversion table for feet and inches listing the number pairs (1, 12), (2, 24), (3, 36), ...'
              },
              {
                key: '2',
                desc: 'Use the four operations to solve word problems involving distances, intervals of time, liquid volumes, masses of objects, and money, including problems involving simple fractions or decimals, and problems that require expressing measurements given in a larger unit in terms of a smaller unit. Represent measurement quantities using diagrams such as number line diagrams that feature a measurement scale.'
              },
              {
                key: '3',
                desc: 'Apply the area and perimeter formulas for rectangles in real world and mathematical problems. For example, find the width of a rectangular room given the area of the flooring and the length, by viewing the area formula as a multiplication equation with an unknown factor.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Represent and interpret data.',
            standards: [
              {
                key: '4',
                desc: 'Make a line plot to display a data set of measurements in fractions of a unit (1/2, 1/4, 1/8). Use operations on fractions for this grade to solve problems involving information presented in line plots. For example, from a line plot find and interpret the difference in length between the longest and shortest specimens in an insect collection.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition.',
            standards: [
              {
                key: '5',
                desc: 'Recognize volume as an attribute of solid figures and understand concepts of volume measurement. A cube with side length 1 unit, called a “unit cube,” is said to have “one cubic unit” of volume, and can be used to measure volume. A solid figure which can be packed without gaps or overlaps using n unit cubes is said to have a volume of n cubic units.'
              },
              {
                key: '6',
                desc: 'Measure volumes by counting unit cubes, using cubic cm, cubic in, cubic ft, and improvised units.'
              },
              {
                key: '7',
                desc: 'Relate volume to the operations of multiplication and addition and solve real world and mathematical problems involving volume.',
                subStandards: [
                  {
                    key: '7a',
                    desc: 'Find the volume of a right rectangular prism with whole-number side lengths by packing it with unit cubes, and show that the volume is the same as would be found by multiplying the edge lengths, equivalently by multiplying the height by the area of the base. Represent threefold whole-number products as volumes, e.g., to represent the associative property of multiplication.'
                  },
                  {
                    key: '7b',
                    desc: 'Apply the formulas V = l × w × h and V = b × h for rectangular prisms to find volumes of right rectangular prisms with whole-number edge lengths in the context of solving real world and mathematical problems.'
                  },
                  {
                    key: '7c',
                    desc: 'Recognize volume as additive. Find volumes of solid figures composed of two non-overlapping right rectangular prisms by adding the volumes of the non-overlapping parts, applying this technique to solve real world problems.'
                  },
                  {
                    key: '7d',
                    desc: 'Use tiling to show in a concrete case that the area of a rectangle with whole-number side lengths a and b + c is the sum of a × b and a × c. Use area models to represent the distributive property in mathematical reasoning.'
                  }
                ]
              },
              {
                key: '8',
                desc: 'Solve real world and mathematical problems involving perimeters of polygons, including finding the perimeter given the side lengths, finding an unknown side length, and exhibiting rectangles with the same perimeter and different areas or with the same area and different perimeters. (Excludes compound units such as cm³ and finding the geometric volume of a container. Excludes multiplicative comparison problems.)'
              }
            ]
          },
          {
            key: 'D',
            desc: 'Geometric measurement: understand concepts of angle and measure angles.',
            standards: [
              {
                key: '9',
                desc: 'Recognize angles as geometric shapes that are formed whenever two rays share a common endpoint, and understand concepts of angle measurement:',
                subStandards: [
                  {
                    key: '9a',
                    desc: 'An angle is measured with reference to a circle with its center at the common endpoint of the rays, by considering the fraction of the circular arc between the points where the two rays intersect the circle. An angle that turns through 1/360 of a circle is called a “one-degree angle,” and can be used to measure angles.'
                  },
                  {
                    key: '9b',
                    desc: 'An angle that turns through n one-degree angles is said to have an angle measure of n degrees.'
                  }
                ]
              },
              {
                key: '10',
                desc: 'Measure angles in whole-number degrees using a protractor. Sketch angles of specified measure.'
              },
              {
                key: '11',
                desc: 'Recognize angle measure as additive. When an angle is decomposed into non-overlapping parts, the angle measure of the whole is the sum of the angle measures of the parts. Solve addition and subtraction problems to find unknown angles on a diagram in real world and mathematical problems, e.g., by using an equation with a symbol for the unknown angle measure.'
              }
            ]
          }
        ]
      },
      {
        key: 'G',
        desc: 'Geometry',
        clusters: [
          {
            key: 'A',
            desc: 'Draw and identify lines and angles, and classify shapes by properties of their lines and angles.',
            standards: [
              {
                key: '1',
                desc: 'Draw points, lines, line segments, rays, angles (right, acute, obtuse), and perpendicular and parallel lines. Identify these in two-dimensional figures.'
              },
              {
                key: '2',
                desc: 'Classify two-dimensional figures based on the presence or absence of parallel or perpendicular lines, or the presence or absence of angles of a specified size. Recognize right triangles as a category, and identify right triangles.'
              },
              {
                key: '3',
                desc: 'Recognize a line of symmetry for a two-dimensional figure as a line across the figure such that the figure can be folded along the line into matching parts. Identify line-symmetric figures and draw lines of symmetry.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: '4',
    desc: '4th',
    domains: [
      {
        key: 'OA',
        desc: 'Operations & Algebraic Thinking',
        clusters: [
          {
            key: 'A',
            desc: 'Use the four operations with whole numbers to solve problems.',
            standards: [
              {
                key: '1',
                desc: 'Interpret a multiplication equation as a comparison, e.g., interpret 35 = 5 × 7 as a statement that 35 is 5 times as many as 7 and 7 times as many as 5. Represent verbal statements of multiplicative comparisons as multiplication equations.'
              },
              {
                key: '2',
                desc: 'Multiply or divide to solve word problems involving multiplicative comparison, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem, distinguishing multiplicative comparison from additive comparison.'
              },
              {
                key: '3',
                desc: 'Solve multistep word problems posed with whole numbers and having whole-number answers using the four operations, including problems in which remainders must be interpreted. Represent these problems using equations with a letter standing for the unknown quantity. Assess the reasonableness of answers using mental computation and estimation strategies including rounding.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Gain familiarity with factors and multiples.',
            standards: [
              {
                key: '4',
                desc: 'Find all factor pairs for a whole number in the range 1–100. Recognize that a whole number is a multiple of each of its factors. Determine whether a given whole number in the range 1–100 is a multiple of a given one-digit number. Determine whether a given whole number in the range 1–100 is prime or composite.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Generate and analyze patterns.',
            standards: [
              {
                key: '5',
                desc: 'Generate a number or shape pattern that follows a given rule. Identify apparent features of the pattern that were not explicit in the rule itself. For example, given the rule “Add 3” and the starting number 1, generate terms in the resulting sequence and observe that the terms appear to alternate between odd and even numbers. Explain informally why the numbers will continue to alternate in this way.'
              }
            ]
          }
        ]
      },
      {
        key: 'NBT',
        desc: 'Number & Operations in Base Ten',
        clusters: [
          {
            key: 'A',
            desc: 'Generalize place value understanding for multi-digit whole numbers.',
            standards: [
              {
                key: '1',
                desc: 'Recognize that in a multi-digit whole number, a digit in one place represents ten times what it represents in the place to its right. For example, recognize that 700 ÷ 70 = 10 by applying concepts of place value and division.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Use place value understanding and properties of operations to perform multi-digit arithmetic.',
            standards: [
              {
                key: '2',
                desc: 'Read and write multi-digit whole numbers using base-ten numerals, number names, and expanded form. Compare two multi-digit numbers based on meanings of the digits in each place, using >, =, and < symbols to record the results of comparisons.'
              },
              {
                key: '3',
                desc: 'Use place value understanding to round multi-digit whole numbers to any place.'
              },
              {
                key: '4',
                desc: 'Fluently add and subtract multi-digit whole numbers using the standard algorithm.'
              },
              {
                key: '5',
                desc: 'Multiply a whole number of up to four digits by a one-digit whole number, and multiply two two-digit numbers, using strategies based on place value and the properties of operations. Illustrate and explain the calculation by using equations, rectangular arrays, and/or area models.'
              },
              {
                key: '6',
                desc: 'Find whole-number quotients and remainders with up to four-digit dividends and one-digit divisors, using strategies based on place value, the properties of operations, and/or the relationship between multiplication and division. Illustrate and explain the calculation by using equations, rectangular arrays, and/or area models.'
              }
            ]
          }
        ]
      },
      {
        key: 'NF',
        desc: 'Number & Operations—Fractions',
        clusters: [
          {
            key: 'A',
            desc: 'Extend understanding of fraction equivalence and ordering.',
            standards: [
              {
                key: '1',
                desc: 'Explain why a fraction a/b is equivalent to a fraction (n × a)/(n × b) by using visual fraction models, with attention to how the number and size of the parts differ even though the two fractions themselves are the same size. Use this principle to recognize and generate equivalent fractions.'
              },
              {
                key: '2',
                desc: 'Compare two fractions with different numerators and different denominators, e.g., by creating common denominators or numerators, or by comparing to a benchmark fraction such as 1/2. Recognize that comparisons are valid only when the two fractions refer to the same whole. Record the results of comparisons with symbols >, =, or <, and justify the conclusions, e.g., by using a visual fraction model.'
              },
              {
                key: '3',
                desc: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.',
                subStandards: [
                  {
                    key: '3a',
                    desc: 'Understand a fraction a/b with a > 1 as a sum of fractions 1/b.'
                  },
                  {
                    key: '3b',
                    desc: 'Understand addition and subtraction of fractions as joining and separating parts referring to the same whole.'
                  },
                  {
                    key: '3c',
                    desc: 'Decompose a fraction into a sum of fractions with the same denominator in more than one way, recording each decomposition by an equation. Justify decompositions, e.g., by using a visual fraction model. Examples: 3/8 = 1/8 + 1/8 + 1/8; 3/8 = 1/8 + 2/8; 2 1/8 = 1 + 1 + 1/8 = 8/8 + 8/8 + 1/8.'
                  },
                  {
                    key: '3d',
                    desc: 'Add and subtract mixed numbers with like denominators, e.g., by replacing each mixed number with an equivalent fraction, and/or by using properties of operations and the relationship between addition and subtraction.'
                  },
                  {
                    key: '3e',
                    desc: 'Solve word problems involving addition and subtraction of fractions referring to the same whole and having like denominators, e.g., by using visual fraction models and equations to represent the problem.'
                  }
                ]
              },
              {
                key: '4',
                desc: 'Apply and extend previous understandings of multiplication to multiply a fraction by a whole number.',
                subStandards: [
                  {
                    key: '4a',
                    desc: 'Understand a fraction a/b as a multiple of 1/b. For example, use a visual fraction model to represent 5/4 as the product 5 × (1/4), recording the conclusion by the equation 5/4 = 5 × (1/4).'
                  },
                  {
                    key: '4b',
                    desc: 'Understand a multiple of a/b as a multiple of 1/b, and use this understanding to multiply a fraction by a whole number. For example, use a visual fraction model to express 3 × (2/5) as 6 × (1/5), recognizing this product as 6/5. (In general, n × (a/b) = (n × a)/b.)'
                  },
                  {
                    key: '4c',
                    desc: 'Solve word problems involving multiplication of a fraction by a whole number, e.g., by using visual fraction models and equations to represent the problem. For example, if each person at a party will eat 3/8 of a pound of roast beef, and there will be 5 people at the party, how many pounds of roast beef will be needed? Between what two whole numbers does your answer lie?'
                  }
                ]
              }
            ]
          },
          {
            key: 'B',
            desc: 'Understand decimal notation for fractions, and compare decimal fractions.',
            standards: [
              {
                key: '5',
                desc: 'Express a fraction with denominator 10 as an equivalent fraction with denominator 100, and use this technique to add two fractions with respective denominators 10 and 100. For example, express 3/10 as 30/100, and add 3/10 + 4/100 = 34/100.'
              },
              {
                key: '6',
                desc: 'Use decimal notation for fractions with denominators 10 or 100. For example, rewrite 0.62 as 62/100; describe a length as 0.62 meters; locate 0.62 on a number line diagram.'
              },
              {
                key: '7',
                desc: 'Compare two decimals to hundredths by reasoning about their size. Recognize that comparisons are valid only when the two decimals refer to the same whole. Record the results of comparisons with the symbols >, =, or <, and justify the conclusions, e.g., by using a visual model.'
              }
            ]
          }
        ]
      },
      {
        key: 'MD',
        desc: 'Measurement & Data',
        clusters: [
          {
            key: 'A',
            desc: 'Solve problems involving measurement and conversion of measurements from a larger unit to a smaller unit.',
            standards: [
              {
                key: '1',
                desc: 'Know relative sizes of measurement units within one system of units including km, m, cm; kg, g; lb, oz.; l, ml; hr, min, sec. Within a single system of measurement, express measurements in a larger unit in terms of a smaller unit. Record measurement equivalents in a two-column table. For example, know that 1 ft is 12 times as long as 1 in. Express the length of a 4 ft snake as 48 in. Generate a conversion table for feet and inches listing the number pairs (1, 12), (2, 24), (3, 36), ...'
              },
              {
                key: '2',
                desc: 'Use the four operations to solve word problems involving distances, intervals of time, liquid volumes, masses of objects, and money, including problems involving simple fractions or decimals, and problems that require expressing measurements given in a larger unit in terms of a smaller unit. Represent measurement quantities using diagrams such as number line diagrams that feature a measurement scale.'
              },
              {
                key: '3',
                desc: 'Apply the area and perimeter formulas for rectangles in real world and mathematical problems. For example, find the width of a rectangular room given the area of the flooring and the length, by viewing the area formula as a multiplication equation with an unknown factor.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Represent and interpret data.',
            standards: [
              {
                key: '4',
                desc: 'Make a line plot to display a data set of measurements in fractions of a unit (1/2, 1/4, 1/8). Solve problems involving addition and subtraction of fractions by using information presented in line plots. For example, from a line plot find and interpret the difference in length between the longest and shortest specimens in an insect collection.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition.',
            standards: [
              {
                key: '5',
                desc: 'Recognize area as an attribute of plane figures and understand concepts of area measurement. A square with side length 1 unit, called “a unit square,” is said to have “one square unit” of area, and can be used to measure area. A plane figure which can be covered without gaps or overlaps by n unit squares is said to have an area of n square units.'
              },
              {
                key: '6',
                desc: 'Measure areas by counting unit squares (square cm, square m, square in, square ft, and improvised units).'
              },
              {
                key: '7',
                desc: 'Relate area to the operations of multiplication and addition. Find the area of a rectangle with whole-number side lengths by tiling it, and show that the area is the same as would be found by multiplying the side lengths. Multiply side lengths to find areas of rectangles with whole-number side lengths in the context of solving real world and mathematical problems, and represent whole-number products as rectangular areas in mathematical reasoning. Use tiling to show in a concrete case that the area of a rectangle with whole-number side lengths a and b + c is the sum of a × b and a × c. Use area models to represent the distributive property in mathematical reasoning. Recognize area as additive. Find areas of rectilinear figures by decomposing them into non-overlapping rectangles and adding the areas of the non-overlapping parts, applying this technique to solve real world problems.'
              },
              {
                key: '8',
                desc: 'Solve real world and mathematical problems involving perimeters of polygons, including finding the perimeter given the side lengths, finding an unknown side length, and exhibiting rectangles with the same perimeter and different areas or with the same area and different perimeters. (Excludes compound units such as cm³ and finding the geometric volume of a container. Excludes multiplicative comparison problems.)'
              }
            ]
          },
          {
            key: 'D',
            desc: 'Geometric measurement: understand concepts of angle and measure angles.',
            standards: [
              {
                key: '9',
                desc: 'Recognize angles as geometric shapes that are formed whenever two rays share a common endpoint, and understand concepts of angle measurement: a. An angle is measured with reference to a circle with its center at the common endpoint of the rays, by considering the fraction of the circular arc between the points where the two rays intersect the circle. An angle that turns through 1/360 of a circle is called a “one-degree angle,” and can be used to measure angles.'
              },
              {
                key: '10',
                desc: 'An angle that turns through n one-degree angles is said to have an angle measure of n degrees.'
              },
              {
                key: '11',
                desc: 'Measure angles in whole-number degrees using a protractor. Sketch angles of specified measure.'
              },
              {
                key: '12',
                desc: 'Recognize angle measure as additive. When an angle is decomposed into non-overlapping parts, the angle measure of the whole is the sum of the angle measures of the parts. Solve addition and subtraction problems to find unknown angles on a diagram in real world and mathematical problems, e.g., by using an equation with a symbol for the unknown angle measure.'
              }
            ]
          }
        ]
      },
      {
        key: 'G',
        desc: 'Geometry',
        clusters: [
          {
            key: 'A',
            desc: 'Draw and identify lines and angles, and classify shapes by properties of their lines and angles.',
            standards: [
              {
                key: '1',
                desc: 'Draw points, lines, line segments, rays, angles (right, acute, obtuse), and perpendicular and parallel lines. Identify these in two-dimensional figures.'
              },
              {
                key: '2',
                desc: 'Classify two-dimensional figures based on the presence or absence of parallel or perpendicular lines, or the presence or absence of angles of a specified size. Recognize right triangles as a category, and identify right triangles.'
              },
              {
                key: '3',
                desc: 'Recognize a line of symmetry for a two-dimensional figure as a line across the figure such that the figure can be folded along the line into matching parts. Identify line-symmetric figures and draw lines of symmetry.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: '3',
    desc: '3rd',
    domains: [
      {
        key: 'OA',
        desc: 'Operations & Algebraic Thinking',
        clusters: [
          {
            key: 'A',
            desc: 'Represent and solve problems involving multiplication and division.',
            standards: [
              {
                key: '1',
                desc: 'Interpret products of whole numbers, e.g., interpret 5 × 7 as the total number of objects in 5 groups of 7 objects each. For example, describe a context in which a total number of objects can be expressed as 5 × 7.'
              },
              {
                key: '2',
                desc: 'Interpret whole-number quotients of whole numbers, e.g., interpret 56 ÷ 8 as the number of objects in each share when 56 objects are partitioned equally into 8 shares, or as a number of shares when 56 objects are partitioned into equal shares of 8 objects each. For example, describe a context in which a number of shares or a number of groups can be expressed as 56 ÷ 8.'
              },
              {
                key: '3',
                desc: 'Use multiplication and division within 100 to solve word problems in situations involving equal groups, arrays, and measurement quantities, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem.'
              },
              {
                key: '4',
                desc: 'Determine the unknown whole number in a multiplication or division equation relating three whole numbers. For example, determine the unknown number that makes the equation true in each of the equations 8 × ? = 48, 5 = ? ÷ 3, 6 × 6 = ?.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Understand properties of multiplication and the relationship between multiplication and division.',
            standards: [
              {
                key: '5',
                desc: 'Apply properties of operations as strategies to multiply and divide. Examples: If 6 × 4 = 24 is known, then 4 × 6 = 24 is also known. (Commutative property of multiplication.) 3 × 5 × 2 can be found by 3 × 5 = 15, then 15 × 2 = 30, or by 5 × 2 = 10, then 3 × 10 = 30. (Associative property of multiplication.) Knowing that 8 × 5 = 40 and 8 × 2 = 16, one can find 8 × 7 as 8 × (5 + 2) = (8 × 5) + (8 × 2) = 40 + 16 = 56. (Distributive property.)'
              },
              {
                key: '6',
                desc: 'Understand division as an unknown-factor problem. For example, find 32 ÷ 8 by finding the number that makes 32 when multiplied by 8.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Multiply and divide within 100.',
            standards: [
              {
                key: '7',
                desc: 'Fluently multiply and divide within 100, using strategies such as the relationship between multiplication and division (e.g., knowing that 8 × 5 = 40, one knows 40 ÷ 5 = 8) or properties of operations. By the end of Grade 3, know from memory all products of two one-digit numbers.'
              }
            ]
          },
          {
            key: 'D',
            desc: 'Solve problems involving the four operations, and identify and explain patterns in arithmetic.',
            standards: [
              {
                key: '8',
                desc: 'Solve two-step word problems using the four operations. Represent these problems using equations with a letter standing for the unknown quantity. Assess the reasonableness of answers using mental computation and estimation strategies including rounding.'
              },
              {
                key: '9',
                desc: 'Identify arithmetic patterns (including patterns in the addition table or multiplication table), and explain them using properties of operations. For example, observe that 4 times a number is always even, and explain why 4 times a number can be decomposed into two equal addends.'
              }
            ]
          }
        ]
      },
      {
        key: 'NBT',
        desc: 'Number & Operations in Base Ten',
        clusters: [
          {
            key: 'A',
            desc: 'Use place value understanding and properties of operations to perform multi-digit arithmetic.',
            standards: [
              {
                key: '1',
                desc: 'Use place value understanding to round whole numbers to the nearest 10 or 100.'
              },
              {
                key: '2',
                desc: 'Fluently add and subtract within 1000 using strategies and algorithms based on place value, properties of operations, and/or the relationship between addition and subtraction.'
              },
              {
                key: '3',
                desc: 'Multiply one-digit whole numbers by multiples of 10 in the range 10–90 (e.g., 9 × 80, 5 × 60) using strategies based on place value and properties of operations.'
              }
            ]
          }
        ]
      },
      {
        key: 'NF',
        desc: 'Number & Operations—Fractions',
        clusters: [
          {
            key: 'A',
            desc: 'Develop understanding of fractions as numbers.',
            standards: [
              {
                key: '1',
                desc: 'Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts; understand a fraction a/b as the quantity formed by a parts of size 1/b.'
              },
              {
                key: '2',
                desc: 'Understand a fraction as a number on the number line; represent fractions on a number line diagram.',
                subStandards: [
                  {
                    key: '2a',
                    desc: 'Represent a fraction 1/b on a number line diagram by defining the interval from 0 to 1 as the whole and partitioning it into b equal parts. Recognize that each part has size 1/b and that the endpoint of the part based at 0 locates the number 1/b on the number line.'
                  },
                  {
                    key: '2b',
                    desc: 'Represent a fraction a/b on a number line diagram by marking off a lengths of 1/b from 0. Recognize that the resulting interval has size a/b and that its endpoint locates the number a/b on the number line.'
                  }
                ]
              },
              {
                key: '3',
                desc: 'Explain equivalence of fractions in special cases, and compare fractions by reasoning about their size.',
                subStandards: [
                  {
                    key: '3a',
                    desc: 'Understand two fractions as equivalent (equal) if they are the same size, or the same point on a number line.'
                  },
                  {
                    key: '3b',
                    desc: 'Recognize and generate simple equivalent fractions, e.g., 1/2 = 2/4, 4/6 = 2/3. Explain why the fractions are equivalent, e.g., by using a visual fraction model.'
                  },
                  {
                    key: '3c',
                    desc: 'Express whole numbers as fractions, and recognize fractions that are equivalent to whole numbers. Examples: Express 3 in the form 3 = 3/1; recognize that 6/1 = 6; locate 4/4 and 1 at the same point of a number line diagram.'
                  },
                  {
                    key: '3d',
                    desc: 'Compare two fractions with the same numerator or the same denominator by reasoning about their size. Recognize that comparisons are valid only when the two fractions refer to the same whole. Record the results of comparisons with the symbols >, =, or <, and justify the conclusions, e.g., by using a visual fraction model.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        key: 'MD',
        desc: 'Measurement & Data',
        clusters: [
          {
            key: 'A',
            desc: 'Solve problems involving measurement and estimation of intervals of time, liquid volumes, and masses of objects.',
            standards: [
              {
                key: '1',
                desc: 'Tell and write time to the nearest minute and measure time intervals in minutes. Solve word problems involving addition and subtraction of time intervals in minutes, e.g., by representing the problem on a number line diagram.'
              },
              {
                key: '2',
                desc: 'Measure and estimate liquid volumes and masses of objects using standard units of grams (g), kilograms (kg), and liters (l).'
              },
              {
                key: '3',
                desc: 'Add, subtract, multiply, or divide to solve one-step word problems involving masses or volumes that are given in the same units, e.g., by using drawings (such as a beaker with a measurement scale) to represent the problem.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Represent and interpret data.',
            standards: [
              {
                key: '4',
                desc: 'Draw a scaled picture graph and a scaled bar graph to represent a data set with several categories. Solve one- and two-step “how many more” and “how many less” problems using information presented in scaled bar graphs. For example, draw a bar graph in which each square in the bar graph might represent 5 pets.'
              },
              {
                key: '5',
                desc: 'Generate measurement data by measuring lengths using rulers marked with halves and fourths of an inch. Show the data by making a line plot, where the horizontal scale is marked off in appropriate units—whole numbers, halves, or quarters.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition.',
            standards: [
              {
                key: '6',
                desc: 'Recognize area as an attribute of plane figures and understand concepts of area measurement. A square with side length 1 unit, called “a unit square,” is said to have “one square unit” of area, and can be used to measure area. A plane figure which can be covered without gaps or overlaps by n unit squares is said to have an area of n square units.'
              },
              {
                key: '7',
                desc: 'Measure areas by counting unit squares (square cm, square m, square in, square ft, and improvised units).'
              },
              {
                key: '8',
                desc: 'Relate area to the operations of multiplication and addition. Find the area of a rectangle with whole-number side lengths by tiling it, and show that the area is the same as would be found by multiplying the side lengths. Multiply side lengths to find areas of rectangles with whole-number side lengths in the context of solving real world and mathematical problems, and represent whole-number products as rectangular areas in mathematical reasoning. Use tiling to show in a concrete case that the area of a rectangle with whole-number side lengths a and b + c is the sum of a × b and a × c. Use area models to represent the distributive property in mathematical reasoning. Recognize area as additive. Find areas of rectilinear figures by decomposing them into non-overlapping rectangles and adding the areas of the non-overlapping parts, applying this technique to solve real world problems.'
              },
              {
                key: '9',
                desc: 'Solve real world and mathematical problems involving perimeters of polygons, including finding the perimeter given the side lengths, finding an unknown side length, and exhibiting rectangles with the same perimeter and different areas or with the same area and different perimeters. (Excludes compound units such as cm³ and finding the geometric volume of a container. Excludes multiplicative comparison problems.)'
              }
            ]
          }
        ]
      },
      {
        key: 'G',
        desc: 'Geometry',
        clusters: [
          {
            key: 'A',
            desc: 'Reason with shapes and their attributes.',
            standards: [
              {
                key: '1',
                desc: 'Understand that shapes in different categories (e.g., rhombuses, rectangles, and others) may share attributes (e.g., having four sides), and that the shared attributes can define a larger category (e.g., quadrilaterals). Recognize rhombuses, rectangles, and squares as examples of quadrilaterals, and draw examples of quadrilaterals that do not belong to any of these subcategories.'
              },
              {
                key: '2',
                desc: 'Partition shapes into parts with equal areas. Express the area of each part as a unit fraction of the whole. For example, partition a shape into 4 parts with equal area, and describe the area of each part as 1/4 of the area of the shape.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: '2',
    desc: '2nd',
    domains: [
      {
        key: 'OA',
        desc: 'Operations & Algebraic Thinking',
        clusters: [
          {
            key: 'A',
            desc: 'Represent and solve problems involving addition and subtraction.',
            standards: [
              {
                key: '1',
                desc: 'Use addition and subtraction within 100 to solve one- and two-step word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem.'
              },
              {
                key: '2',
                desc: 'Solve word problems that call for addition of three whole numbers whose sum is less than or equal to 20, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Add and subtract within 20.',
            standards: [
              {
                key: '2',
                desc: 'Fluently add and subtract within 20 using mental strategies. By end of Grade 2, know from memory all sums of two one-digit numbers.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Work with equal groups of objects to gain foundations for multiplication.',
            standards: [
              {
                key: '3',
                desc: 'Determine whether a group of objects (up to 20) has an odd or even number of members, e.g., by pairing objects or counting them by 2s; write an equation to express an even number as a sum of two equal addends.'
              },
              {
                key: '4',
                desc: 'Use addition to find the total number of objects arranged in rectangular arrays with up to 5 rows and up to 5 columns; write an equation to express the total as a sum of equal addends.'
              }
            ]
          }
        ]
      },
      {
        key: 'NBT',
        desc: 'Number & Operations in Base Ten',
        clusters: [
          {
            key: 'A',
            desc: 'Understand place value.',
            standards: [
              {
                key: '1',
                desc: 'Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones; e.g., 706 equals 7 hundreds, 0 tens, and 6 ones.'
              },
              {
                key: '1a',
                desc: '100 can be thought of as a bundle of ten tens — called a “hundred.”'
              },
              {
                key: '1b',
                desc: 'The numbers 100, 200, 300, 400, 500, 600, 700, 800, 900 refer to one, two, three, four, five, six, seven, eight, or nine hundreds (and 0 tens and 0 ones).'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Extend the counting sequence.',
            standards: [
              {
                key: '2',
                desc: 'Count within 1000; skip-count by 5s, 10s, and 100s.'
              },
              {
                key: '3',
                desc: 'Read and write numbers to 1000 using base-ten numerals, number names, and expanded form.'
              },
              {
                key: '4',
                desc: 'Compare two three-digit numbers based on meanings of the hundreds, tens, and ones digits, using >, =, and < symbols to record the results of comparisons.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Use place value understanding and properties of operations to add and subtract.',
            standards: [
              {
                key: '5',
                desc: 'Fluently add and subtract within 100 using strategies based on place value, properties of operations, and/or the relationship between addition and subtraction.'
              },
              {
                key: '6',
                desc: 'Add up to four two-digit numbers using strategies based on place value and properties of operations.'
              },
              {
                key: '7',
                desc: 'Add and subtract within 1000, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method. Understand that in adding or subtracting three-digit numbers, one adds or subtracts hundreds and hundreds, tens and tens, ones and ones; and sometimes it is necessary to compose or decompose tens or hundreds.'
              },
              {
                key: '8',
                desc: 'Mentally add 10 or 100 to a given number 100–900, and mentally subtract 10 or 100 from a given number 100–900.'
              },
              {
                key: '9',
                desc: 'Explain why addition and subtraction strategies work, using place value and the properties of operations.'
              }
            ]
          }
        ]
      },
      {
        key: 'MD',
        desc: 'Measurement & Data',
        clusters: [
          {
            key: 'A',
            desc: 'Measure and estimate lengths in standard units.',
            standards: [
              {
                key: '1',
                desc: 'Measure the length of an object by selecting and using appropriate tools such as rulers, yardsticks, meter sticks, and measuring tapes.'
              },
              {
                key: '2',
                desc: 'Measure the length of an object twice, using length units of different lengths for the two measurements; describe how the two measurements relate to the size of the unit chosen.'
              },
              {
                key: '3',
                desc: 'Estimate lengths using units of inches, feet, centimeters, and meters.'
              },
              {
                key: '4',
                desc: 'Measure to determine how much longer one object is than another, expressing the length difference in terms of a standard length unit.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Relate addition and subtraction to length.',
            standards: [
              {
                key: '5',
                desc: 'Use addition and subtraction within 100 to solve word problems involving lengths that are given in the same units, e.g., by using drawings (such as drawings of rulers) and equations with a symbol for the unknown number to represent the problem.'
              },
              {
                key: '6',
                desc: 'Represent whole numbers as lengths from 0 on a number line diagram with equally spaced points corresponding to the numbers 0, 1, 2, ..., and represent whole-number sums and differences within 100 on a number line diagram.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Work with time and money.',
            standards: [
              {
                key: '7',
                desc: 'Tell and write time from analog and digital clocks to the nearest five minutes, using a.m. and p.m.'
              },
              {
                key: '8',
                desc: 'Solve word problems involving dollar bills, quarters, dimes, nickels, and pennies, using $ and ¢ symbols appropriately. Example: If you have 2 dimes and 3 pennies, how many cents do you have?'
              }
            ]
          },
          {
            key: 'D',
            desc: 'Represent and interpret data.',
            standards: [
              {
                key: '9',
                desc: 'Generate measurement data by measuring lengths of several objects to the nearest whole unit, or by making repeated measurements of the same object. Show the measurements by making a line plot, where the horizontal scale is marked off in whole-number units.'
              },
              {
                key: '10',
                desc: 'Draw a picture graph and a bar graph (with single-unit scale) to represent a data set with up to four categories. Solve simple put-together, take-apart, and compare problems using information presented in a bar graph.'
              }
            ]
          }
        ]
      },
      {
        key: 'G',
        desc: 'Geometry',
        clusters: [
          {
            key: 'A',
            desc: 'Reason with shapes and their attributes.',
            standards: [
              {
                key: '1',
                desc: 'Recognize and draw shapes having specified attributes, such as a given number of angles or a given number of equal faces. Identify triangles, quadrilaterals, pentagons, hexagons, and cubes.'
              },
              {
                key: '2',
                desc: 'Partition a rectangle into rows and columns of same-size squares and count to find the total number of them.'
              },
              {
                key: '3',
                desc: 'Partition circles and rectangles into two, three, or four equal shares, describe the shares using the words halves, thirds, half of, a third of, etc., and describe the whole as two halves, three thirds, four fourths. Recognize that equal shares of identical wholes need not have the same shape.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Partition shapes into parts with equal areas. Express the area of each part as a unit fraction of the whole.',
            standards: [
              {
                key: '4',
                desc: 'Partition circles and rectangles into two, three, or four equal shares, describe the shares using the words halves, thirds, half of, a third of, etc., and describe the whole as two halves, three thirds, four fourths. Recognize that equal shares of identical wholes need not have the same shape.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: '1',
    desc: '1st',
    domains: [
      {
        key: 'OA',
        desc: 'Operations & Algebraic Thinking',
        clusters: [
          {
            key: 'A',
            desc: 'Represent and solve problems involving addition and subtraction.',
            standards: [
              {
                key: '1',
                desc: 'Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.'
              },
              {
                key: '2',
                desc: 'Solve word problems that call for addition of three whole numbers whose sum is less than or equal to 20, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Understand and apply properties of operations and the relationship between addition and subtraction.',
            standards: [
              {
                key: '3',
                desc: 'Apply properties of operations as strategies to add and subtract. Examples: If 8 + 3 = 11 is known, then 3 + 8 = 11 is also known. (Commutative property of addition.) To add 2 + 6 + 4, the second two numbers can be added to make a ten, so 2 + 6 + 4 = 2 + 10 = 12. (Associative property of addition.)'
              },
              {
                key: '4',
                desc: 'Understand subtraction as an unknown-addend problem. For example, subtract 10 – 8 by finding the number that makes 10 when added to 8.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Add and subtract within 20.',
            standards: [
              {
                key: '5',
                desc: 'Relate counting to addition and subtraction (e.g., by counting on 2 to add 2).'
              },
              {
                key: '6',
                desc: 'Add and subtract within 20, demonstrating fluency for addition and subtraction within 10. Use strategies such as counting on; making ten (e.g., 8 + 6 = 8 + 2 + 4 = 10 + 4 = 14); decomposing a number leading to a ten (e.g., 13 – 4 = 13 – 3 – 1 = 10 – 1 = 9); using the relationship between addition and subtraction (e.g., knowing that 8 + 4 = 12, one knows 12 – 8 = 4); and creating equivalent but easier or known sums (e.g., adding 6 + 7 by creating the known equivalent 6 + 6 + 1 = 12 + 1 = 13).'
              }
            ]
          },
          {
            key: 'D',
            desc: 'Work with addition and subtraction equations.',
            standards: [
              {
                key: '7',
                desc: 'Understand the meaning of the equal sign, and determine if equations involving addition and subtraction are true or false. For example, which of the following equations are true and which are false? 6 = 6, 7 = 8 – 1, 5 + 2 = 2 + 5, 4 + 1 = 5 + 2.'
              },
              {
                key: '8',
                desc: 'Determine the unknown whole number in an addition or subtraction equation relating three whole numbers. For example, determine the unknown number that makes the equation true in each of the equations 8 + ? = 11, 5 = ? – 3, 6 + 6 = ?.'
              }
            ]
          }
        ]
      },
      {
        key: 'NBT',
        desc: 'Number & Operations in Base Ten',
        clusters: [
          {
            key: 'A',
            desc: 'Extend the counting sequence.',
            standards: [
              {
                key: '1',
                desc: 'Count to 120, starting at any number less than 120. In this range, read and write numerals and represent a number of objects with a written numeral.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Understand place value.',
            standards: [
              {
                key: '2a',
                desc: '10 can be thought of as a bundle of ten ones — called a “ten.”'
              },
              {
                key: '2b',
                desc: 'The numbers from 11 to 19 are composed of a ten and one, two, three, four, five, six, seven, eight, or nine ones.'
              },
              {
                key: '2c',
                desc: 'The numbers 10, 20, 30, 40, 50, 60, 70, 80, 90 refer to one, two, three, four, five, six, seven, eight, or nine tens (and 0 ones).'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Compare two two-digit numbers based on meanings of the tens and ones digits, recording the results of comparisons with the symbols >, =, and <.',
            standards: [
              {
                key: '3',
                desc: 'Compare two two-digit numbers based on meanings of the tens and ones digits, recording the results of comparisons with the symbols >, =, and <.'
              }
            ]
          },
          {
            key: 'D',
            desc: 'Use place value understanding and properties of operations to add and subtract.',
            standards: [
              {
                key: '4',
                desc: 'Add within 100, including adding a two-digit number and a one-digit number, and adding a two-digit number and a multiple of 10, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used. Understand that in adding two-digit numbers, one adds tens and tens, ones and ones; and sometimes it is necessary to compose a ten.'
              },
              {
                key: '5',
                desc: 'Given a two-digit number, mentally find 10 more or 10 less than the number, without having to count; explain the reasoning used.'
              },
              {
                key: '6',
                desc: 'Subtract multiples of 10 in the range 10-90 from multiples of 10 in the range 10-90 (positive or zero differences), using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used.'
              }
            ]
          }
        ]
      },
      {
        key: 'MD',
        desc: 'Measurement & Data',
        clusters: [
          {
            key: 'A',
            desc: 'Measure lengths indirectly and by iterating length units.',
            standards: [
              {
                key: '1',
                desc: 'Order three objects by length; compare the lengths of two objects indirectly by using a third object.'
              },
              {
                key: '2',
                desc: 'Express the length of an object as a whole number of length units, by laying multiple copies of a shorter object (the length unit) end to end; understand that the length measurement of an object is the number of same-size length units that span it with no gaps or overlaps. Limit to contexts where the object being measured is spanned by a whole number of length units with no gaps or overlaps.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Tell and write time.',
            standards: [
              {
                key: '3',
                desc: 'Tell and write time in hours and half-hours using analog and digital clocks.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Represent and interpret data.',
            standards: [
              {
                key: '4',
                desc: 'Organize, represent, and interpret data with up to three categories; ask and answer questions about the total number of data points, how many in each category, and how many more or less are in one category than in another.'
              }
            ]
          }
        ]
      },
      {
        key: 'G',
        desc: 'Geometry',
        clusters: [
          {
            key: 'A',
            desc: 'Reason with shapes and their attributes.',
            standards: [
              {
                key: '1',
                desc: 'Distinguish between defining attributes (e.g., triangles are closed and three-sided) versus non-defining attributes (e.g., color, orientation, overall size); build and draw shapes to possess defining attributes.'
              },
              {
                key: '2',
                desc: 'Compose two-dimensional shapes (rectangles, squares, trapezoids, triangles, half-circles, and quarter-circles) or three-dimensional shapes (cubes, right rectangular prisms, right circular cones, and right circular cylinders) to create a composite shape, and compose new shapes from the composite shape.'
              },
              {
                key: '3',
                desc: 'Partition circles and rectangles into two and four equal shares, describe the shares using the words halves, fourths, and quarters, and use the phrases half of, fourth of, and quarter of. Describe the whole as two of, or four of the shares. Understand for these examples that decomposing into more equal shares creates smaller shares.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Partition shapes into parts with equal areas. Express the area of each part as a unit fraction of the whole.',
            standards: [
              {
                key: '4',
                desc: 'Partition circles and rectangles into two and four equal shares, describe the shares using the words halves, fourths, and quarters, and use the phrases half of, fourth of, and quarter of. Describe the whole as two of, or four of the shares. Understand for these examples that decomposing into more equal shares creates smaller shares.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: 'K',
    desc: 'K',
    domains: [
      {
        key: 'CC',
        desc: 'Counting & Cardinality',
        clusters: [
          {
            key: 'A',
            desc: 'Know number names and the count sequence.',
            standards: [
              { key: '1', desc: 'Count to 100 by ones and by tens.' },
              { key: '2', desc: 'Count forward beginning from a given number within the known sequence.' },
              { key: '3', desc: 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20 (with 0 representing a count of no objects).' }
            ]
          },
          {
            key: 'B',
            desc: 'Count to tell the number of objects.',
            standards: [
              {
                key: '4',
                desc: 'Understand the relationship between numbers and quantities; connect counting to cardinality.',
                subStandards: [
                  {
                    key: 'a',
                    desc: 'When counting objects, say the number names in the standard order, pairing each object with one and only one number name and each number name with one and only one object.'
                  },
                  {
                    key: 'b',
                    desc: 'Understand that the last number name said tells the number of objects counted. The number of objects is the same regardless of their arrangement or the order in which they were counted.'
                  },
                  {
                    key: 'c',
                    desc: 'Understand that each successive number name refers to a quantity that is one larger.'
                  }
                ]
              },
              {
                key: '5',
                desc: 'Count to answer “how many?” questions about as many as 20 things arranged in a line, a rectangular array, or a circle, or as many as 10 things in a scattered configuration; given a number from 1–20, count out that many objects.'
              },
              {
                key: '6',
                desc: 'Identify whether the number of objects in one group is greater than, less than, or equal to another group, e.g., by using matching and counting strategies.'
              },
              {
                key: '7',
                desc: 'Compare two numbers between 1 and 10 presented as written numerals.'
              }
            ]
          }
        ]
      },
      {
        key: 'OA',
        desc: 'Operations & Algebraic Thinking',
        clusters: [
          {
            key: 'A',
            desc: 'Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.',
            standards: [
              {
                key: '1',
                desc: 'Represent addition and subtraction with objects, fingers, mental images, drawings, sounds (e.g., claps), acting out situations, verbal explanations, expressions, or equations.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Solve addition and subtraction word problems, and add and subtract within 10.',
            standards: [
              {
                key: '2',
                desc: 'Solve addition and subtraction word problems, and add and subtract within 10, e.g., by using objects or drawings to represent the problem.'
              }
            ]
          },
          {
            key: 'C',
            desc: 'Decompose numbers less than or equal to 10 into pairs in more than one way.',
            standards: [
              {
                key: '3',
                desc: 'Decompose numbers less than or equal to 10 into pairs in more than one way, e.g., by using objects or drawings, and record each decomposition by a drawing or equation (e.g., 5 = 2 + 3 and 5 = 4 + 1).'
              }
            ]
          },
          {
            key: 'D',
            desc: 'For any number from 1 to 9, find the number that makes 10 when added to the given number.',
            standards: [
              {
                key: '4',
                desc: 'For any number from 1 to 9, find the number that makes 10 when added to the given number, e.g., by using objects or drawings, and record the answer with a drawing or equation.'
              }
            ]
          },
          {
            key: 'E',
            desc: 'Fluently add and subtract within 5.',
            standards: [
              {
                key: '5',
                desc: 'Fluently add and subtract within 5.'
              }
            ]
          }
        ]
      },
      {
        key: 'NBT',
        desc: 'Number & Operations in Base Ten',
        clusters: [
          {
            key: 'A',
            desc: 'Work with numbers 11–19 to gain foundations for place value.',
            standards: [
              {
                key: '1',
                desc: 'Compose and decompose numbers from 11 to 19 into ten ones and some further ones, e.g., by using objects or drawings, and record each composition or decomposition by a drawing or equation (e.g., 18 = 10 + 8); understand that these numbers are composed of ten ones and one, two, three, four, five, six, seven, eight, or nine ones.'
              }
            ]
          }
        ]
      },
      {
        key: 'MD',
        desc: 'Measurement & Data',
        clusters: [
          {
            key: 'A',
            desc: 'Describe and compare measurable attributes.',
            standards: [
              {
                key: '1',
                desc: 'Describe measurable attributes of objects, such as length or weight. Describe several measurable attributes of a single object.'
              },
              {
                key: '2',
                desc: 'Directly compare two objects with a measurable attribute in common, to see which object has “more of”/“less of” the attribute, and describe the difference. For example, directly compare the heights of two children and describe one child as taller/shorter.'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Classify objects and count the number of objects in each category.',
            standards: [
              {
                key: '3',
                desc: 'Classify objects into given categories; count the numbers of objects in each category and sort the categories by count.'
              }
            ]
          }
        ]
      },
      {
        key: 'G',
        desc: 'Geometry',
        clusters: [
          {
            key: 'A',
            desc: 'Identify and describe shapes (squares, circles, triangles, rectangles, hexagons, cubes, cones, cylinders, and spheres).',
            standards: [
              {
                key: '1',
                desc: 'Describe objects in the environment using names of shapes, and describe the relative positions of these objects using terms such as above, below, beside, in front of, behind, and next to.'
              },
              {
                key: '2',
                desc: 'Correctly name shapes regardless of their orientations or overall size.'
              },
              {
                key: '3',
                desc: 'Identify shapes as two-dimensional (lying in a plane, “flat”) or three-dimensional (“solid”).'
              }
            ]
          },
          {
            key: 'B',
            desc: 'Analyze, compare, create, and compose shapes.',
            standards: [
              {
                key: '4',
                desc: 'Analyze and compare two- and three-dimensional shapes, in different sizes and orientations, using informal language to describe their similarities, differences, parts (e.g., number of sides and vertices/“corners”) and other attributes (e.g., having sides of equal length).'
              },
              {
                key: '5',
                desc: 'Model shapes in the world by building shapes from components (e.g., sticks and clay balls) and drawing shapes.'
              },
              {
                key: '6',
                desc: 'Compose simple shapes to form larger shapes. For example, “Can you join these two triangles with full sides touching to make a rectangle?”'
              }
            ]
          }
        ]
      }
    ]
  }
];

export default ccssDictionary;