#include <iostream>

using namespace std;

int main(int argc, char const *argv[]){

    if (argc == 1){
        cout << "Please give an argument\n";
        return 0;
    }
    
    string arg = argv[1];

    for (size_t i = 0; i < arg.size(); i ++){
        arg[i] = toupper(arg[i]);
    }

    cout << arg << "\n";

    return 0;
}
