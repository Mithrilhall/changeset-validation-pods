import Ember from 'ember';
import isBuffer from 'npm:is-buffer';

export default Ember.Route.extend({
    model: function () {

        return {
            firstName: 'William',
            lastName: 'Wallace',
            address: {
                country: 'Scotland',
                town: 'Elderslie',
                state: {
                    abbreviation: "AK",
                    name: "Alaska"
                }
            }
        };
    },
    afterModel: function (model) {
        Ember.set(model, 'flatModel', this.flatten(model, { delimiter: "$" }));
    },
    flatten: function (target, opts) {
        opts = opts || {};

        var delimiter = opts.delimiter || '.';
        var maxDepth = opts.maxDepth;
        var output = {};

        function step(object, prev, currentDepth) {
            currentDepth = currentDepth ? currentDepth : 1;
            Object.keys(object).forEach(function (key) {
                var value = object[key];
                var isarray = opts.safe && Array.isArray(value);
                var type = Object.prototype.toString.call(value);
                var isbuffer = isBuffer(value);
                var isobject = (
                    type === "[object Object]" ||
                    type === "[object Array]"
                );

                var newKey = prev ? prev + delimiter + key : key;

                if (!isarray && !isbuffer && isobject && Object.keys(value).length &&
                    (!opts.maxDepth || currentDepth < maxDepth)) {
                    return step(value, newKey, currentDepth + 1);
                }

                output[newKey] = value;
            });
        }

        step(target);

        return output;
    }
});
