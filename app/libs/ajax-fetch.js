
import node from 'detect-node';

if (node) {
    const packageJson = eval('require')(path.resolve(__dirname, '..', 'react', 'package.json'));
}
else {

}