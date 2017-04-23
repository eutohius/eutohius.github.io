/**
 * Created by antonsidorenko on 23.04.17.
 */

(function($, undefined) {
    $(function() {
        $.getJSON('https://raw.githubusercontent.com/goit-fe/markup_fe2o/master/js_19-20/data.json', function(data) {

            // First task 1. Массив скиллов (поле skills) всех людей, не должно быть повторяющихся скиллов, так же они должны быть отсортированы по алфавиту
            var allSkillsSorted = [];
            $.each(data, function() {
                allSkillsSorted = _.union(allSkillsSorted, this.skills);
            });
            allSkillsSorted.sort(function(a, b) {
                if (a.toLowerCase() < b.toLowerCase()) return -1;
                else return 1;
            });
            console.log(allSkillsSorted);

            // Second task 2. Массив имен (поле name) людей, отсортированных в зависимости от количества их друзей (friends)
            var result = data;
            result.sort(function(a,b) {
                if (a.friends.length < b.friends.length) return -1;
                    if (a.friends.length === b.friends.length && a.name < b.name) return -1;
                else return 1;
            });
            result = result.map(function(obj) {
                return obj.name;
            });
            console.log(result);

            //Third task 3. Массив всех друзей всех пользователей, не должно быть повторяющихся людей
            var dataDeepClone = _.cloneDeep(data),
                allFriends = [];
            $.each(dataDeepClone, function() {
                allFriends = _.unionWith(allFriends, this.friends, function(a, b) {
                    return a.name == b.name;
                });
            });

            console.log(allFriends);
        });
    });
})(jQuery);