require('jest');

import Index from '../index';

describe('Imports from index at help action', () => {
    it('works fine', () => {
        expect(Index).toBeTruthy();
    });
});
