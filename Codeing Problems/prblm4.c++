#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct YearPrice {
    int year;
    int price;
};

int minimizeLoss(const vector<int>& prices) {
    int minLoss = INT_MAX;
    vector<YearPrice> yearPrices;

    for (int i = 0; i < prices.size(); ++i) {
        yearPrices.push_back({i + 1, prices[i]});
    }

    sort(yearPrices.begin(), yearPrices.end(), [](const YearPrice& a, const YearPrice& b) {
        return a.price < b.price;
    });

    for (int i = 1; i < yearPrices.size(); ++i) {
        if (yearPrices[i].price > yearPrices[i - 1].price) {
            minLoss = min(minLoss, yearPrices[i].price - yearPrices[i - 1].price);
        }
    }

    return minLoss;
}

int main() {
    vector<int> prices = {20, 15, 7, 2, 13};

    int minLoss = minimizeLoss(prices);

    cout << "Min Loss: " << minLoss << endl;

    return 0;
}
