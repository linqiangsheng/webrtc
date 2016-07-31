/**
 * User: _Jay
 * Desciption: UUID Helper. Generate UUID By Math.random
 * Dependent on: Math.random
 * Datetime: 31 July 2016 (Sunday) 19:47
 */

var UUIDHelper = {
    /**
     * generate UUID like 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
     * @returns {string}
     */
    generateUUID: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    /**
     * generate UUID like 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'
     * @returns {string}
     */
    generateUUIDWithoutSP: function() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};