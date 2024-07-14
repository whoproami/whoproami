#include <iostream>
#include <string>
#include <sstream>
#include <iomanip>

using namespace std;

string indianCurrencyFormat(double number) {
    stringstream ss;
    ss << fixed << setprecision(4) << number; 
    string s = ss.str();
    
    int len = s.find('.') - 1, n = 0;
    for (int i = len; i >= 0; i--) {
        if (++n % 2 == 0 && i != 0) s.insert(i, ",");
    }
    return s;
}

int main() {
    double number = 123456.7891;

    string formatted = indianCurrencyFormat(number);

    cout << "Formatted Indian Currency: " << formatted << endl;

    return 0;
}
