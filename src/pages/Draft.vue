<template>
  <!--                      <q-card >
                                         <q-card-section v-for="(comment, index) in post.comments"  :key="comment.id" @click="emoShow = false">
                                           &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;Edit Comment Start -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;
                                           <template >
                                             <div class="q-pa-md" v-show="activeInput">
                                               <div class="cursor-pointer">
                                                 <q-icon name="edit" right v-show="activateEditComment(comment)"></q-icon>
                                                 <q-popup-edit v-model="comment.comment" :validate="val => val.length > 5">
                                                   <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
                                                     <q-input
                                                       autofocus
                                                       dense
                                                       :value="comment.comment"
                                                       hint="Edit this Comment"
                                                       :rules="[val => validate(value) || 'More than '+ val.length +' chars required']"
                                                       @input="emitValue"
                                                       @keydown.enter.prevent="editComment(comment.comment)"
                                                     >

                                                       <template v-slot:after>
                                                         <q-btn
                                                           dense flat icon="send"
                                                           @click="editComment(comment.comment)"
                                                           @click.stop="set"
                                                         />
                                                         <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                                                         <q-btn flat dense color="positive" icon="check_circle" @click.stop="set"
                                                                @click="editComment(comment.comment)"
                                                                :disable="validate(value) === false || initialValue === value" />
                                                       </template>
                                                     </q-input>
                                                   </template>
                                                 </q-popup-edit>
                                               </div>
                                             </div>
                                           </template>
                                           &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;Edit Comment End -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;
                                           &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;Comment Reactions Start -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;
                                           <q-item >
                                             <q-fab
                                               label=""
                                               label-position="top"
                                               external-label
                                               color="transparent"
                                               icon="keyboard_arrow_right"
                                               direction="right"
                                               text-color="black"
                                               padding="xs"
                                               dense
                                               flat
                                             >
                                               <q-fab-action
                                                 @click="reactComment('Like',comment, post)"
                                                 :icon="reactionEmoji('thumbsup')"
                                                 external-label
                                                 label-position="top"
                                                 text-color="red"
                                                 :label="comment.reaction_count[1] > 0 ? comment.reaction_count[1]  :'' "
                                                 padding="xs"
                                                 dense
                                                 flat
                                               />
                                               <q-fab-action
                                                 @click="reactComment('DisLike',comment, post)"
                                                 :icon="reactionEmoji('thumbsdown')"
                                                 external-label
                                                 label-position="top"
                                                 text-color="black"
                                                 :label="comment.reaction_count[2]  > 0 ? comment.reaction_count[2]  :''"
                                                 padding="xs"
                                                 dense
                                                 flat
                                               />
                                               <q-fab-action
                                                 @click="reactComment('Happy',comment, post)"
                                                 :icon="reactionEmoji('smiley_cat')"
                                                 external-label
                                                 label-position="top"
                                                 text-color="black"
                                                 :label="comment.reaction_count[5]  > 0 ? comment.reaction_count[5]  :''"
                                                 padding="xs"
                                                 dense
                                                 flat
                                               />
                                               <q-fab-action
                                                 @click="reactComment('DisHappy',comment, post)"
                                                 :icon="reactionEmoji('rage')"
                                                 external-label
                                                 label-position="top"
                                                 text-color="amber"
                                                 :label="comment.reaction_count[6]  > 0 ? comment.reaction_count[6]  :''"
                                                 padding="xs"
                                                 dense
                                                 flat
                                               />
                                               <q-fab-action
                                                 @click="reactComment('Surprise',comment, post)"
                                                 :icon="reactionEmoji('shrug')"
                                                 external-label
                                                 label-position="top"
                                                 text-color="blue"
                                                 :label="comment.reaction_count[7]  > 0 ? comment.reaction_count[7]  :''"
                                                 padding="xs"
                                                 dense
                                                 flat
                                               />
                                               <q-fab-action
                                                 @click="reactComment('Smile',comment, post)"
                                                 :icon="reactionEmoji('shocked_face_with_exploding_head')"
                                                 external-label
                                                 label-position="top"
                                                 text-color="black"
                                                 :label="comment.reaction_count[9] > 0 ? comment.reaction_count[9]  :''"
                                                 padding="xs"
                                                 dense
                                                 flat
                                               />
                                             </q-fab>

                                           </q-item>
                                           &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;Comment Reactions  End-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;
                                           <q-chat-message
                                             @click="switchInput"
                                             :name="comment.commenter.name"
                                             :avatar="comment.commenter.photo_url"
                                             position="up"
                                             :text="[comment.comment]"
                                             size=""
                                             :stamp="comment.created_dates.created_at_human"
                                             text-color="black"
                                             bg-color="blue-grey-1"
                                             dense
                                           >
                                           </q-chat-message>
                                           &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;Comment Reply Input Start  -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;
                                           <q-input
                                             v-show="activeInput"
                                             switch-toggle-side dense-toggle :header-inset-level="1" :content-inset-level="2"
                                             label="...whats your opinion"
                                             v-model="replyBox[index]"
                                             class="col col-sm-6"
                                             dense
                                             @keydown.enter.prevent="replyComment(replyBox[index], comment,post)"
                                             icon="eva-message-circle-outline"
                                             options-dens
                                             @keyup.esc="replyBox[index]=''"
                                           >
                                             <template v-slot:before>
                                               <q-avatar>
                                                 <img :src="$auth.user()?$auth.user().photo_url:'https://cdn.quasar.dev/img/avatar5.jpg'">
                                               </q-avatar>
                                             </template>
                                             <template v-slot:after>
                                               <q-btn
                                                 round dense flat icon="send"
                                                 @click.prevent="replyComment(replyBox[index], comment, post)"
                                               />
                                             </template>
                                           </q-input>
                                           <div class="row justify-center q-ma-md">
                                           </div>
                                           &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;Comment Reply Input End -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;

                                           &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;Comment  -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;

                                           &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;Replies  -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;
                                           <q-expansion-item
                                             v-show="comment.childComments.length > 0"
                                             switch-toggle-side dense-toggle :header-inset-level="1" :content-inset-level="2"
                                             expand-separator
                                             icon="eva-message-circle"
                                             label="All reactions"
                                             :caption="comment.childComments.length + ' reactions'"
                                             default-closed
                                             bg-color="blue-grey-12"
                                           >
                                             <q-chat-message
                                               v-if="comment.childComments.length > 0"
                                               v-for="(childComment, index) in comment.childComments"
                                               :key="childComment.id"
                                               :name="childComment.commenter.name"
                                               :avatar="childComment.commenter.photo_url"
                                               position="up"
                                               :text="[childComment.comment]"
                                               :stamp="childComment.created_at | niceDate"
                                               text-color="dark-blue"
                                               bg-color="amber-1"
                                               dense
                                               label=""
                                               sent
                                             />

                                           </q-expansion-item>
                                           &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;Replies  -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;

                                         </q-card-section>
                                       </q-card>-->
</template>

<script>
export default {
  name: "Draft",

  methods : {


  }
}
</script>

<style scoped>

</style>
