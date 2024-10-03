const ExampleQuestions = {
  "ExampleQuestions": [
    {
      "question": "A child is raising a flag up a 20-foot flag pole. She starts pulling at a rate of 2 feet per second for 5 seconds, but she starts to get tired and decreases her rate to 1/2 foot per second for the remainder of the time. In total, how many seconds does it take her to raise the flag from the bottom to the top?",
      "correctAnswer": "25",
      "correctExplanation": "1. Distance = (rate)(time). You might see this if you use the units in your equation. For the first 5 seconds, the child raises the flag up the pole at a rate of 2 ft/s. If we multiply those together, we can see that the seconds cancel: (2 ft/s)(5 s) = 10 feet 2. The flag is 10 feet up the 20-foot pole before the child gets tired, which means that she still has to raise the flag another 10 feet.  3. At a rate of 1/2 ft/s for the remainder of the task, we are solving the following equation for t to find the remaining time it takes her to raise the flag up the rest of the pole: (1/2 ft/s)(t seconds) = 10 feet. This yields t = 20 seconds as the remaining time.4. Adding the 5 seconds (from raising the flag at 2 ft/s for the first 10 feet) and 20 seconds (from raising the flag at 1/2 ft/s for the second 10 feet), we get a total time of 25 seconds. ",
      "incorrectAnswers": [
        {
          "answer": "10",
          "explanation": "At an initial rate of 2 ft/s for 5 seconds, the child raises the flag (2 ft/s)(5 s) = 10 feet. To calculate the time for the child to raise the flag the second 10 feet, you need to solve the equation 10 = (1/2)(t). You will find that t = 20 seconds. This is the amount of time it takes the child to raise the flag at 1/2 ft/s for the second 10 feet. Instead of the above calculation, students may have incorrectly multiplied 1/2 ft/s by 10 ft to get 5 seconds (and 5 + 5 = 10). Note that if you accidentally multiplied 1/2 ft/s x 10 ft, you would actually get 5 ft^2/s (not 5 s)."
        },
        {
          "answer": "20",
          "explanation": "Students may have correctly found that it took 20 seconds to raise the flag the second 10 feet, but not remembered to add it to the 5 seconds that were used to raise the flag the first 10 feet: 5 seconds (for the first 10 feet) + 20 seconds (for the second 10 feet) = 25 seconds total"
        },
        {
          "answer": "13.75",
          "explanation": "Students may have confused the relationship between distance, rate and time. Instead of distance = (rate)(time), they may have thought (distance)(rate) = time. To find the height, they then might have thought they needed to solve (d feet)(2 feet/second) = 5 seconds, yielding d = 2.5 feet. [Note that the units in this equation do not make sense: on the left you have (ft)(ft/s), which would result in (ft^2)/s, while on the right you have just seconds.] To get the remaining time it takes to raise the flag the remaining 17.5 feet, they might try to use the same incorrect equation (17.5 feet)(1/2 feet/second) = t seconds, yielding 8.75 seconds. Students might then add 5 + 8.75 seconds to get 13.75 seconds."
        }
      ] 
    },
    {
      "question": "If f(x) = x^2 + 2x + 3, what is the value of f(x), when x = 6?",
      "correctAnswer": "51",
      "correctExplanation": "1. The value of f(x) when x = 6 means that we are replacing all the x's with 6's in the expression given for f(x). 2. f(x) = x^2 + 2x +3 would become f(6) = 6^2 + 2(6) + 3.3. 6^2 = (6)(6) = 36. 2(6) = 12.4. f(6) = 36 + 12 + 3 = 51",
      "incorrectAnswers": [
        {
          "answer": "27",
          "explanation": "Almost there! Students may have thought that 6^2 equals 6(2), which would yield f(6) = 12 + 12 + 3  = 27. Remember, 6^2 means that you are multiplying 6 by itself twice. So 6^2 = (6)(6) and 6^3 = (6)(6)(6). "
        },
        {
          "answer": "41",
          "explanation": "Students may have incorrectly thought that 6^2 means to multiply 6 and 2, and that 2x means to replace the x with a 6 in the ones place, thus creating a new number, 26. This would have led them to believe that 6^2 was 12 (instead of 36) and 2x would evaluate to 26 (instead of (2)(6)=12). This would have given them the incorrect answer: f(6) = 6^2 + 26 + 3 = 12 + 26 + 3 = 41."
        },
        {
          "answer": "65",
          "explanation": "Oh no. Students may have misinterpreted 2x and didn't realize it means to multiply 2 with x: (2)(6) = 12. Instead, they may have thought that 2x means to replace the x with a 6 in the ones place, thus creating a new number, 26. If they made that mistake but computed 6^2 correctly as 36, they may have thought that f(x) = 6^2 + 26 + 3 = 36 + 26 + 3 = 65."
        }
      ] 
    },
    {
      "question": "A pie's size is determined by its diameter. For example, a 10-inch pie has a 10-inch diameter and a 5-inch pie has a 5-inch diameter. Sabrina and Nick go to a bakery. Sabrina orders two 5-inch pies and Nick orders a 10-inch pie. What is the difference, in square inches, between the area of Nick's pie and the combined area of Sabrina's pies? Round your answer to the nearest whole number.",
      "correctAnswer": "39",
      "correctExplanation": "1. The formula for the area of a circle is Area = 𝜋 r^2 where r is the radius. That means the first thing we need to do is find the radius of each pie. Diameter = 2(radius) 2. The 10-inch pie has a 10-inch diameter, which means its radius is 5 inches. The 5-inch pie has a 5-inch diameter, which means its radius is 2.5 inches. 3. The area of a 10-inch pie is approximately (3.14)(5^2) = (3.14)(25) = 78.5 in^2. The area of one 5-inch pie is approximately (3.14)(2.5^2) = (3.14)(6.25) = 19.625 in^2. Sabrina ordered two 5-inch pies, so we must multiply the area of a 5-inch pie by 2, yielding 2(19.625) = 39.25 in^2. 4. We were asked for the difference between the area of Nick's pie and the combined area of Sabrina's pies, so we must subtract 78.5 - 39.25 = 39.25 in^2. Since we were asked to round to the nearest whole number, the difference is approximately 39 in^2.",
      "incorrectAnswers": [
        {
          "answer": "157",
          "explanation": "Oops! Students may have used the diameter instead of the radius when computing the area."
        },
        {
          "answer": "0",
          "explanation": "Students may have used the circumference formula, Circumference = 𝜋 (diameter) or Circumference = 2 𝜋 (radius), instead of the area formula for a circle, Area = 𝜋 (radius)^2. They could have also incorrectly assumed that one 10-inch pie is equivalent in area to two 5-inch pies."
        },
        {
          "answer": "59",
          "explanation": "Students may have forgotten to multiply the area of the 5-inch pie by 2 before subtracting from the area of the 10-inch pie. If students subtracted the area of only one 5-inch pie (A = 19.625 in^2) from the area of the 10-inch pie (A = 78.5 in^2), then they would get 78.5 - 19.625 = 58.875 in^2, which would round up to 59 in^2"
        }
      ] 
    },
    {
      "question": "A pie's size is determined by its diameter. For example, a 12-inch pie has a 12-inch diameter and a 6-inch pie has a 6-inch diameter. Sam and Xiomara go to a bakery. Sam orders two 6-inch pies and Xiomara orders a 12-inch pie.What is the difference, in square inches, between the area of Xiomara's pie and the combined area of Sam's pies? Round your answer to the nearest whole number.",
      "correctAnswer": "57",
      "correctExplanation": "1. The formula for the area of a circle is Area = 𝜋 r^2 where r is the radius. That means the first thing we need to do is find the radius of each pie. Diameter = 2(radius) 2. The 12-inch pie has a 12-inch diameter, which means its radius is 6 inches. The 6-inch pie has a 6-inch diameter, which means its radius is 3 inches. 3. The area of a 12-inch pie is approximately (3.14)(6^2) = (3.14)(36) = 113.04 in^2. The area of one 6-inch pie is approximately (3.14)(3^2) = (3.14)(9)= 28.26 in^2. Sam ordered two 6-inch pies, so we must multiply the area of a 6-inch pie by 2, yielding 2(28.26)= 56.52 in^2. 4. We were asked for the difference between the area of Xiomara's pie and the combined area of Sam's pies, so we must subtract 113.04 - 56.52 = 56.52 in^2. Since we were asked to round to the nearest whole number, the difference is approximately 57 in^2.",
      "incorrectAnswers": [
        {
          "answer": "226",
          "explanation": "Oops! Students may have used the diameter instead of the radius when computing the area."
        },
        {
          "answer": "0",
          "explanation": "Students may have used the circumference formula, Circumference = 𝜋 (diameter) or Circumference = 2 𝜋 (radius), instead of the area formula for a circle, Area = 𝜋 (radius)^2. They could have also incorrectly assumed that one 12-inch pie is equivalent in area to two 6-inch pies."
        },
        {
          "answer": "85",
          "explanation": "Students may have forgotten to multiply the area of the 6-inch pie by 2 before subtracting from the area of the 12-inch pie. If students subtracted the area of only one 6-inch pie (A = 28.26 in^2) from the area of the 12-inch pie (A = 113.04 in^2), then they would get 113.04 - 28.26 = 84.78 in^2, which would round up to 85 in^2."
        }
      ] 
    },
    {
      "question": "What value of x will make the following equation true? 3(x + 15) - 6x = -6(x - 3) ",
      "correctAnswer": "-9",
      "correctExplanation": "1. First, you must distribute the 3 on the left side of the equation to both terms of (x + 15): 3(x + 15) - 6x = -6(x - 3) 3x + 45 - 6x = -6(x - 3) 2. Now, we need to distribute the -6 on the right side of the equation to both terms of (x - 3): 3x + 45 - 6x = -6x + 18 Remember that (-6)(-3) = 18 because the product of two negative numbers is positive.  3. Now we can add 6x to both sides of the equation to eliminate the x term on the right: 3x + 45 - 6x + 6x = -6x + 6x + 183x + 45 = 184. Finally, we can subtract 45 from both sides of the equation to eliminate the 45 on the left:3x + 45 - 45 = 18 - 453x = -27 5. We can now divide both sides by 3 to solve for x 3x/3 = -27/3 x = -9 It's important to check your answers, so let's see if x = -9 works! 3(-9 + 15) - 6(-9) = -6(-9-3) 3(6) + 54 = -6(-12) 18 + 54 = 72  TRUE!!!",
      "incorrectAnswers": [
        {
          "answer": "-6",
          "explanation": "Students may have forgotten to distribute the 3 to both terms of x + 15, and may have forgotten to distribute the -6 to both terms of x - 3. Students may have then gotten the equation 3x + 15 - 6x = -6x - 3 instead of 3x + 45 - 6x = -6x + 18. Students may have correctly solved 3x + 15 - 6x = -6x - 3, but that was not the equation they were supposed to solve."
        },
        {
          "answer": "-21",
          "explanation": "Students probably distributed correctly, but might have forgotten that the product of two negative numbers is a positive number. (-6)(-3) = 18 (not -18). Instead of 3x + 45 - 6x = -6x + 18, students may have worked with 3x + 45 - 6x = -6x - 18."
        },
        {
          "answer": "-16",
          "explanation": "Starting with 3(x + 15) - 6x = -6(x - 3), students may have incorrectly cancelled the -6x's on both sides of the equation first, resulting in 3(x + 15) = -3. It's possible that students did not remember the order of operations when solving this equation."
        }
      ] 
    },
    {
      "question": "What is the y-value of the y-intercept of the line g(x) = -3x + 5?",
      "correctAnswer": "5",
      "correctExplanation": "1.The equation for a line in slope-intercept form is y = mx + b, where m is the slope and b is the y-value of the y-intercept. 2. The function is called g(x), but since g(x) is the y-coordinate of the graph, then we can substitute g(x) for y so that g(x) = y. This means that function g(x) is of the form g(x) = mx + b, where m is the slope and b is the y-value of the y-intercept. 3. Since g(x) = -3x + 5, then m = -3 and b = 5. So the y-value of the y-intercept is 5. 4. Alternatively, recall that the y-intercept is the point at which x = 0. Since g(0) = -3(0) + 5 = 5, then the y-intercept is (0,5).",
      "incorrectAnswers": [
        {
          "answer": "-3",
          "explanation": "Students may have confused the slope for the y-intercept. The slope of the line is -3, but the y-intercept is (0,5). Recall that the y-intercept is the point at which x = 0, Therefore, g(0) = -3(0) + 5 = 5."
        },
        {
          "answer": "-3x",
          "explanation": "Students may have confused the slope for the y-intercept, and addiionally, thought the slope was the entire x-term. Recall that the y-intercept is the point at which x = 0, Therefore, g(0) = -3(0) + 5 = 5"
        },
        {
          "answer": "5/3",
          "explanation": "Students may have confused the x-intercept for the y-intercept. Students may have set y = 0, so 0 = -3x + 5 would give -5 = -3x, which in turn would yield 5/3 = x. This would give an x-intercept of (5/3, 0), but we were asked for the y-intercept. Rememeber that the y-intercept is the point at which x = 0, and since g(0) = -3(0) + 5, the y-intercept is (0,5), and its y-value is 5, which is the correct answer."
        }
      ] 
    },
    {
      "question": "What is the slope of the line y = (3/4)x - 7?",
      "correctAnswer": "3/4",
      "correctExplanation": "1. The equation for a line in slope-intercept form is y = mx + b, where m is the slope and b is the y-value of the y-intercept. 2. Since g(x) = (3/4)x - 2, then m = 3/4 and b = -7. So the slope of the line is 3/4 and the y-value of the y-intercept is -7. ",
      "incorrectAnswers": [
        {
          "answer": "(3/4)x",
          "explanation": "Students may have confused the slope for the x-term, rather than the coefficient of x in the form y = mx + b. In this example, they thought the slope was the entire x-term, 3/4 x, rather than just the coefficient, which is 3/4.  Recall, that the slope is defined to be the ratio of the change in y over the change in x, which means it must be a real number."
        },
        {
          "answer": "7",
          "explanation": "Students may have confused the y-intercept of the line for the slope of the line and also missed the sign of the y-intercept. Recall that the slope is the coefficient of x, while the y-intercept is the value of point at which x = 0."
        },
        {
          "answer": "-7",
          "explanation": "Students may have confused the slope of the line for the y-intercept. Recall that the slope is the ratio of the change in y over the change in x, while the y-intercept is the point at which x = 0, which is obtained by plugging in x = 0 into the equation, y = 3/4(0) -7 = -7."
        }
      ] 
    },
    {
      "question": "A pair of shoes were 10% off last week. This week, there’s an additional sale, and you can get an extra 40% off the already discounted price from last week. What is the total percentage discount that you’d get if you buy the shoes this week?",
      "correctAnswer": "46%",
      "correctExplanation": "1. Let’s say the original price of the shoes was $P. With the 10% off last week, you would’ve paid 100% - 10% = 90% of the original price, or .90P. 2. This week, with the additional 40% off, you would pay 60% of last week’s sale price of .90P, or .60(.90P). 3. .60(.90P) = .54P 4. Note that .54P is the amount you would pay if you bought the shoes this week. 5. The question asks for the total percentage discount. This equals P - 0.54P = 0.46P, which is a 46% discount from the original price.",
      "incorrectAnswers": [
        {
          "answer": "50%",
          "explanation": "Students may have added the discounts, 10% + 40% = 50%, rather than considering that the 40% discount is applied to last week's discounted price."
        },
        {
          "answer": "54%",
          "explanation": "Students may have correctly calculated the amount paid (0.54P), but did not note that the question asks for the total percentage discount, which is P - 0.54P = 0.46P, or a 46% discount."
        },
        {
          "answer": "14%",
          "explanation": "Students may have considered 40% off of the 10% discounted price to mean 40% of 10%, which would yield (0.40)(0.10) = 0.04 or 4%. If they interpreted 'additional' as adding the discounts, then 10% + 4% = 14%."
        }
      ] 
    },
    {
      "question": "You set a goal for yourself to walk for 1 hour each day. Yesterday, you walked 42 minutes. What percentage of your daily goal did you reach yesterday?",
      "correctAnswer": "70%",
      "correctExplanation": "1. Notice that the goal is measured in hours per day, and the amount walk is measured in minutes. So, the first step is to convert both units to minutes. 2. Since there are 60 minutes per hour, we can represent the goal  of walking an hour a day as walking 60 minutes per day. 3. You walked 42 minutes out of the 60 minute goal. To compute the percentage, we should divide the minutes walked by the goal minutes, or 42/60= 0.70 4. To convert 0.70 to percent, we must multiply 0.70 by 100, 0.70(100) = 70%",
      "incorrectAnswers": [
        {
          "answer": "143%",
          "explanation": "Students may have reversed the order of the division and divided 60 minutes by 42 minutes, converting 60/42 into 143%, instead of 42/60 = 70%."
        },
        {
          "answer": "42%",
          "explanation": "Students may have forgotten to convert hours to minutes prior to dividing 42 minutes by 1 hour, to get 42. Additionally, it's possible that the student understood 42 to be 42% rather than converting 42 into percent by multiplying by 100, to get 4200%."
        },
        {
          "answer": "4200%",
          "explanation": "Students may have forgotten to convert hours to minutes prior to dividing 42 minutes by 1 hour, to get 42. then converted 42 into percent by multiplying by 100, to get 4200%."
        }
      ] 
    },
    {
      "question": "Sam took her friends to the movies on Friday. She spent 10 dollars on each movie ticket she purchased, and 2 dollars on each bag of popcorn she bought. She spent a total of 78 dollars at the movies, and bought 3 more movie tickets than she bought bags of popcorn. If x represents the number of movie tickets she purchased and y represents the number of bags of popcorn she bought, find the system of equations that can be used to solve how many movie tickets and bags of popcorn she bought.",
      "correctAnswer": "10x + 2y = 78, x = y + 3",
      "correctExplanation": "1. Since x represents the number of movie tickets Sam bought and she spent $10 on each movie ticket, then the total money she spent on movie tickets is represented by 10x. 2. Since y represents the number of bags of popcorn Sam bought and she spent $2 on each bag of popcorn, then total amount of money she spent on popcorn is represented by 2y. 3. The total amount Sam spent, $78, is the sum of what she spent on movie tickets, 10x, andwhat she spent on popcorn, 2y, which yields the equation 10x + 2y = 78. 4. She bought 3 more movie tickets, x, than she bought bags of popcorn, y. In other words, x is 3 more than y. We can interpret 'is' as '='. So, x = 3 + y. 5. To ensure that you've interpreted this last sentence correctly, it helps to check your equation by using some hypothetical, or made-up, numbers. For example, if Sam bought 2 bags of popcorn, y = 2, than she would have bought 3 more movie tickets, x = 5. Does that make the equation x = y + 3 true? 5 = 2 + 3 Yes!",
      "incorrectAnswers": [
        {
          "answer": "10y + 2x = 78, x = y + 3",
          "explanation": "Students may have switched the variables, y = number of popcorn bags, and x = number of movie tickets, on the first equation and not the second."
        },
        {
          "answer": "10x + 2y = 78, y = x + 3",
          "explanation": "Students sometimes misinterpret '3 more x than y' as 3 + x = y instead of x = y + 3. Rewording '3 more x than y' to an equivalent sentence with an 'is' may help students determine where to put the equal sign. For example, 'there are 3 more x than y' can be reworded as 'x is 3 more than y' which yields the expression x = y + 3"
        },
        {
          "answer": "10y + 2x = 78, y = x + 3",
          "explanation": "Students may have switched the variables, y = number of popcorn bags, and x = number of movie tickets, on both equations."
        }
      ] 
    }
  ]
}

export default ExampleQuestions;