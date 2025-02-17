export interface Coding_Task {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const questions: Coding_Task[] = [
  {
    id: 1,
    question: `(C++) What is the output of the following code snippet?

      #include <iostream>
      using namespace std;
      
      int main() {
          int a = 7, b = 2;
          cout << a / b;
          return 0;
      }`,
    options: ["3.5", "3", "3.0", "Undefined"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: `(C++) Which of the following correctly allocates a dynamic array for 5 integers and initializes them to 0?
      
      // Option A:
      int *arr = new int[5]();
      
      // Option B:
      int *arr = new int[5];
      
      // Option C:
      int *arr = new int(5);
      
      // Option D:
      int *arr = (int*)calloc(5, sizeof(int));`,
    options: ["Option A", "Option B", "Option C", "Options A and D"],
    correctAnswer: 3
  },
  {
    id: 3,
    question: `(Python) Complete the code to safely convert a string input to an integer, printing an error message if conversion fails:
      
      try:
          num = int(input("Enter a number: "))
      except ______ as e:
          print("Error:", e)`,
    options: ["Exception", "ValueError", "(ValueError, TypeError)", "Both a and b"],
    correctAnswer: 3
  },
  {
    id: 4,
    question: `(Java) Which line correctly declares and initializes an array of 4 integers with values 1, 2, 3, and 4?
      
      // Option A:
      int[] arr = new int[4]{1, 2, 3, 4};
      
      // Option B:
      int arr[] = {1, 2, 3, 4};
      
      // Option C:
      int[] arr = {1, 2, 3, 4};
      
      // Option D:
      Both B and C`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 3
  },
  {
    id: 5,
    question: `(C++) What is the output of the following nested loop?

      #include <iostream>
      using namespace std;
      
      int main() {
          for (int i = 0; i < 2; i++) {
              for (int j = 0; j < 2; j++)
                  cout << i + j;
          }
          return 0;
      }`,
    options: ["0123", "0112", "0113", "0122"],
    correctAnswer: 1
  },
  {
    id: 6,
    question: `(Python) Identify and fix the syntax error in the following snippet:
      
      for i in range(3)
          print(i, end=" ")`,
    options: ["Add a colon after `range(3)`", "Remove the colon", "Change `range(3)` to `xrange(3)`", "Indent the print statement further"],
    correctAnswer: 0
  },
  {
    id: 7,
    question: `(Java) What will be printed by the following code?
      
      public class Main {
          public static void main(String[] args) {
              int x = 17;
              System.out.println(x % 5);
          }
      }`,
    options: ["2", "3", "1", "0"],
    correctAnswer: 0
  },
  {
    id: 8,
    question: `(C++) Identify the error in this code snippet:

      #include <iostream>
      using namespace std;
      
      int main() {
          int x = 10
          cout << x;
          return 0;
      }`,
    options: ["Missing semicolon after `int x = 10`", "Missing return type for main()", "Incorrect cout syntax", "No error"],
    correctAnswer: 0
  },
  {
    id: 9,
    question: `(Python) Complete the function to return the cube of a number:
      
      def cube(x):
          return ______
      print(cube(3))`,
    options: ["x * 3", "x ** 3", "pow(x, 3)", "Both b and c"],
    correctAnswer: 3
  },
  {
    id: 10,
    question: `(Java) What does the following code print?
      
      public class Test {
        public static void main(String[] args) {
          int x = 7;
          System.out.println(x % 3);
        }
      }`,
    options: ["1", "2", "0", "3"],
    correctAnswer: 0
  },
  {
    id: 11,
    question: `(C++) Which option correctly overloads the '+' operator for a class named \`Complex\`?
      
      // Option A:
      Complex operator+(const Complex &c);
      
      // Option B:
      void operator+(const Complex &c);
      
      // Option C:
      Complex operator+(Complex c);
      
      // Option D:
      Both A and C`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 3
  },
  {
    id: 12,
    question: `(Python) What is the output of this code?
      
      lst = [1, 2, 3]
      lst.append([4,5])
      print(len(lst))`,
    options: ["5", "4", "6", "7"],
    correctAnswer: 1
  },
  {
    id: 13,
    question: `(Java) Identify the error in this code snippet and select the fix:
      
      public class Hello {
        public static void main(String[] args) {
          System.out.println("Hello World")
        }
      }`,
    options: ["Add a semicolon after the println statement", "Change class name", "Modify the main method signature", "No error"],
    correctAnswer: 0
  },
  {
    id: 14,
    question: `(C++) What is the output of the following code?
      
      #include <iostream>
      using namespace std;
      
      int main() {
         int a = 10;
         cout << ++a;
         return 0;
      }`,
    options: ["10", "11", "12", "Undefined"],
    correctAnswer: 1
  },
  {
    id: 15,
    question: `(Python) Complete the code to catch exceptions when converting a string to an integer:
      
      try:
          num = int("abc")
      except ______ as e:
          print("Error:", e)`,
    options: ["Exception", "ValueError", "TypeError", "Both a and b"],
    correctAnswer: 3
  },
  {
    id: 16,
    question: `(Java) Identify the mistake that makes the variable immutable in the following code:
      
      final int x = 10;
      x = 20; // Error occurs here.`,
    options: ["Remove final", "Declare x as final", "Comment out or remove the assignment after initialization", "Change int to Integer"],
    correctAnswer: 2
  },
  {
    id: 17,
    question: `(C++) Which of these correctly declares a constant integer?
      
      // Option A:
      const int num = 5;
      
      // Option B:
      int const num = 5;
      
      // Option C:
      int num const = 5;
      
      // Option D:
      Both A and B are correct.`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 3
  },
  {
    id: 18,
    question: `(Python) What is printed by the following code?
      
      def multiply(a, b=3):
          return a * b
      print(multiply(4))`,
    options: ["7", "12", "4", "Error"],
    correctAnswer: 1
  },
  {
    id: 19,
    question: `(Java) Complete the code to instantiate an object of class \`Car\`:
      
      public class Car { }
      public class Main {
        public static void main(String[] args) {
          Car myCar = ______;
        }
      }`,
    options: ["Car();", "new Car();", "Car.new();", "create Car();"],
    correctAnswer: 1
  },
  {
    id: 20,
    question: `(C++) What is the output of this code involving post-increment?
      
      #include <iostream>
      using namespace std;
      
      int main() {
         int x = 5;
         int y = x++;
         cout << y;
         return 0;
      }`,
    options: ["4", "5", "6", "Undefined"],
    correctAnswer: 1
  },
  {
    id: 21,
    question: `(Python) Identify and fix the error in the following loop:
      
      for i in range(5)
          print(i)`,
    options: ["Add a colon after `range(5)`", "Change `range(5)` to `xrange(5)`", "Remove the print statement", "Indent the print statement"],
    correctAnswer: 0
  },
  {
    id: 22,
    question: `(Java) What does the following code print using the ternary operator?
      
      public class Main {
        public static void main(String[] args) {
           int a = 8, b = 10;
           System.out.println(a > b ? a : b);
        }
      }`,
    options: ["8", "10", "Error", "18"],
    correctAnswer: 1
  },
  {
    id: 23,
    question: `(C++) In the following code, what is the type of \`ptr\`?
      
      int x = 100;
      int *ptr = &x;`,
    options: ["Integer", "Pointer to integer", "Reference to integer", "Integer array"],
    correctAnswer: 1
  },
  {
    id: 24,
    question: `(Python) Complete the code to open a file named "input.txt" for reading:
      
      f = open("input.txt", ______)`,
    options: ["\"w\"", "\"r\"", "\"a\"", "\"x\""],
    correctAnswer: 1
  },
  {
    id: 25,
    question: `(Java) Complete the catch block to handle multiple exceptions (Java 7+):
      
      try {
          // Code that may throw IOException or SQLException
      } catch(______ ex) {
          ex.printStackTrace();
      }`,
    options: ["IOException | SQLException", "IOException || SQLException", "IOException, SQLException", "Exception"],
    correctAnswer: 0
  },
  {
    id: 26,
    question: `(C++) Which is the correct destructor declaration for class \`MyClass\`?
      
      class MyClass {
        public:
           ______;
      };`,
    options: ["~MyClass();", "MyClass::~MyClass();", "destructor MyClass();", "void ~MyClass();"],
    correctAnswer: 0
  },
  {
    id: 27,
    question: `(Python) What happens when this code is executed?
      
      x = [1, 2, 3]
      print(x[3])`,
    options: ["Prints 3", "Prints None", "Raises IndexError", "Raises KeyError"],
    correctAnswer: 2
  },
  {
    id: 28,
    question: `(Java) Complete the following code t decinter arithmetic code:
      
      #include <iostream>
      using namespace std;
      
      int main() {
         int arr[3] = {5, 10, 15};
         int *ptr = arr;
         cout << *(ptr + 1);
         return 0;
      }`,
    options: ["The code is correct", "Change *(ptr + 1) to ptr[1]", "Remove the dereference operator", "Use &arr instead of arr"],
    correctAnswer: 0
  },
  {
    id: 48,
    question: `(Python) Complete the code to define a function with a default parameter:
      
      def greet(name, msg="Hello"):
          return msg + " " + name
      print(greet("Alice"))`,
    options: ["Correct as is", "Remove the default parameter", "Use a lambda instead", "Add a colon after function definition"],
    correctAnswer: 0
  },
  {
    id: 49,
    question: `(Java) What is the output of the following code involving string concatenation in a loop?
      
      public class ConcatTest {
        public static void main(String[] args) {
           String s = "";
           for(int i = 0; i < 3; i++) {
              s += i;
           }
           System.out.println(s);
        }
      }`,
    options: ["012", "123", "3", "Error"],
    correctAnswer: 0
  },
  {
    id: 50,
    question: `(C++) Complete the code to include the standard I/O header:
      
      #include ______
      int main() {
         std::cout << "Hello, World!";
         return 0;
      }`,
    options: ["<cstdio>", "<stdlib.h>", "<iostream>", "<conio.h>"],
    correctAnswer: 2
  }
];
