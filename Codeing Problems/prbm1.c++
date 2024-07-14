#include <iostream>
#include <string>

using namespace std;


string caesarCipher(const string& message, int shift) {
    string result = "";

    for (char ch : message) {
        if (isupper(ch)) {
            result += char(int(ch + shift - 65) % 26 + 65);
        }

        else if (islower(ch)) {
            result += char(int(ch + shift - 97) % 26 + 97);
        }

        else {
            result += ch;
        }
    }

    return result;
}

int main() {
    string message = "Hello, universe";
    int shift = 3;

    string encoded = caesarCipher(message, shift);
    string decoded = caesarCipher(encoded, -shift);

    cout << "Original:" << message << endl;
    cout << "Encoded:" << encoded << endl;
    cout << "Decoded " << decoded << endl;

    return 0;
}
