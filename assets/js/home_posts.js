{
    // Method to submit the form data for new post using AJAX.
    let createPost=function(){
        let newPostForm=$('#new-post-form');
        newPostForm.submit(function (e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    console.log(data);
                    let newPost=newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button',newPost));
                    new PostComments(data.data.post._id);
                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    };

    // Method to create a post in DOM.
    let newPostDom=function(post){
        return $(`<li id="post-${post._id}">
                    <p>
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                        </small>
                        ${post.content}<br>
                        <small> ${post.user.name}</small>
                    </p>
                    <div class="post-comments">
                        <form action="/comments/create" method="POST">
                            <input type="text" name="content" placeholder="Comment here..." required>
                            <input type="hidden" name="post" value="${post._id}">
                            <input type="submit" value="Post Comment"> 
                        </form>
                        <div class="post-comments-list">
                            <ul id="post-comments-${post._id}">
                            </ul>
                        </div>
                    </div>
                </li>`);
    };

    //method to delete a post from DOM.
    let deletePost=function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post deleted!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: function(error){
                    console.log(error);
                }
            });
        });
    }

    let convertPostsToAjax=function(){
        $('#posts-list-container>ul>li').each(function(){
            let self=$(this);
            let deleteButton=$(' .delete-post-button', self);
            deletePost(deleteButton);
            let postId=self.prop('id').split("-")[1];
            new PostComments(postId);
        });
    };

    createPost();
    convertPostsToAjax();
}