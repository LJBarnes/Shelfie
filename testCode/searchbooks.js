/* eslint-disable for-direction */
/* eslint-disable no-undef */
$(document).ready(function () {


    // eslint-disable-next-line no-undef
    $('#searchBtn').click(function () {
        console.log('click');
        var searchInput = $('#searchBar').val().trim();
        console.log('searchInput' + searchInput);
        // search query works and returns response
        var queryURL = 'https://www.googleapis.com/books/v1/volumes?q=' + searchInput + '&key=AIzaSyDHWfAVWQPX7UK1qgA-EZvxpQROi2uXe_w';
        event.preventDefault();


        $.ajax({
            url: queryURL,
            method: 'GET',
            contentType: 'application/json'
        }).then(function (response) {
            $('#bookDiv').empty();
            // logs search result/response
            console.log(response);

            // will have to have a loop to go through all or some (maybe 3-5?) of the response
            for (i = 0; i < response.items.length; i++) {
                var smallThumb = '';
                if ((response.items[i].volumeInfo.imageLinks.smallThumbnail)) {
                    smallThumb = response.items[i].volumeInfo.imageLinks.smallThumbnail;
                }
                else { smallThumb = '#'; }


                var createImg = $('<img class=bookImg src=' + smallThumb + '>');
                var bookTitle = response.items[i].volumeInfo.title;
                var bookAuthor = response.items[i].volumeInfo.authors[0];
                var bookDesc = response.items[i].volumeInfo.description;
                var id = response.items[i].id;
                // TAKE OUT RADIO BUTTONS FOR NOW, BOOK GOES STRAIGHT TO UNREAD
                //     var createRadioBtns = $(`<div class='control'>
                //     <label class='radio'>
                //       <input data-id='`+ i + `' type='radio' name='Read'>
                //       <strong>Have Read</strong>
                //     </label>
                //     <label class='radio'>
                //       <input data-id='`+ i + `' type='radio' name='Unread'>
                //       <strong>Want To Read</strong>
                //     </label>
                //     <label class='radio'>
                //       <input data-id='`+ i + `'type='radio' name='Currently'>
                //       <strong>Currently Reading</strong>
                //     </label>
                //   </div>`);
                // may have to create individual ids if  it's going to save that info into db?
                var createSaveBtn = $('<button data-id="' + id + '" class="saveBtn">Add to Shelf</button>');

                console.log(bookTitle);
                console.log(bookAuthor);
                console.log(bookDesc);

                $('#bookDiv').addClass('has-background-light');
                $('#bookDiv').append(createImg);
                $('#bookDiv').append('<br>');
                // $('#bookDiv').append(createRadioBtns);
                $('#bookDiv').append(createSaveBtn);
                $('#bookDiv').append('<br>');
                $('.saveBtn').addClass('button is-primary');
                $('#bookDiv').append('<strong>Title:</strong> <span data-id="' + id + '> ' + bookTitle + '</span><br>');
                $('#bookDiv').append('<strong>Author:</strong> ' + bookAuthor + '<br>');
                $('#bookDiv').append('<strong>Description:</strong> ' + bookDesc + '<br>');
                $('#bookDiv').append('<br><br>');
            }

        });


    });
    $(document).on('click', '.saveBtn', function () {
        event.preventDefault();
        var dataID = $(this).attr('data-id');
        var dataTitle = $(this).attr('data-title');
        console.log(dataTitle);
        console.log(dataID);
        let newBook = {
            book_title: dataTitle,
            book_id: dataID,
            book_shelf: 'Unread'
        };
        $.ajax('/api/addNewBook', {
            type: 'POST',
            data: newBook
        }).then(
            function () {
                console.log(`Created new book ${newBook}`);
                location.reload();
            }
        );
    });
});

$(document).on('click', '.changeToRead', function() {
    var id = $(this).data("id");
    var newDevoured = $(this).data("newDevoured");

    var newDevouredState = {
        devoured: 1
    };

    // Send the PUT request.
    // do i need to add +id to end of update shelf?
    $.ajax("api/updateShelf", {
        type: "PUT",
        data: newDevouredState
    }).then(
        function () {
            console.log("changed devoured to", newDevoured);
            // Reload the page to get the updated list
            location.reload();
        }
    );
    console.log("update", newDevouredState);
});