{
    // Method to submit the form data for new post using AJAX.
    let createPost=function(){
        let newPostForm=$('#new-post-form');
        newPostForm.submit(function (e){
            let data=newPostForm.serialize();
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: data,
                success: function(data){
                    let newPost=newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    if($('.post').length){
                        $('#posts-list-container>ul').children().last().addClass('hide');
                    }
                    deletePost($(' .delete-post-button', newPost));
                    new PostComments(data.data.post._id);
                    new ToggleLike($(' .toggle-like-button', newPost));
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
        let img_url="/images/default-dp.jpg";
        if(post.user.avatar){
            img_url=post.user.avatar;
        }
        return $(`<li id="post-${post._id}" class="post">
                        <section class="post-section">
                            <div class="user-pic">
                                <img src=${img_url} />
                            </div>
                            <div>
                                <p class="post-user-name">${post.user.name}</p>
                                <p class="post-content">${post.content}</p>
                                <div class="post-options">
                                    <span id="post-${post._id}-likes">Likes: ${post.likes.length}</span>
                                    <div>
                                        <a class="toggle-like-button" type="Post" data-likes="${post.likes.length}" href="/likes/toggle/?id=${post._id}&type=Post" postId="${post._id}">
                                            <button type="button" class="pointer" style="margin-right: 50px;"><i class="fa-regular fa-xl fa-thumbs-up"></i></button>
                                        </a>
                                        <span>
                                            <a class="delete-post-button" href="/posts/destroy/${post._id}">delete</a>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section class="comment-section">
                            <h4>Comments</h4>
                            <form id="post-${post._id}-comments-form" class="post-comments-form" action="/comments/create" method="POST">
                                <textarea name="content" placeholder="Comment here..." required spellcheck="false"></textarea>
                                <input type="hidden" name="post" value="${post._id}">
                                <input type="submit" value="comment" class="pointer"> 
                            </form>
                            <ul id="post-comments-${post._id}" class="comments-list-container">
                                <small class="replacement-text">No comments yet.</small>
                            </ul>
                        </section>  
                    </li>`);
    }

    //method to delete a post from DOM.
    let deletePost=function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    if($('.post').length == 0){
                        $('#posts-list-container>ul').children().last().removeClass('hide');
                    }
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