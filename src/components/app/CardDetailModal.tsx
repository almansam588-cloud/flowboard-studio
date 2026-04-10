import { useStore } from "@/store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, Paperclip, Clock, Link2, MessageCircle, Play, Square } from "lucide-react";
import { useState } from "react";
import { useCardDetail, useUpdateCard, useBoardData } from "@/hooks/useBoardData";

const priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
const priorityStyles: Record<string, string> = {
  CRITICAL: 'bg-destructive text-destructive-foreground',
  HIGH: 'bg-warning text-warning-foreground',
  MEDIUM: 'bg-primary text-primary-foreground',
  LOW: 'bg-muted text-muted-foreground',
  NONE: 'bg-muted text-muted-foreground',
};

export function CardDetailModal({ cardId, onClose }: { cardId: string; onClose: () => void }) {
  const { data: detail, isLoading } = useCardDetail(cardId);
  const updateCard = useUpdateCard();
  const [newComment, setNewComment] = useState("");

  if (isLoading || !detail?.card) return null;

  const { card, comments, attachments, dependencies } = detail;

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 mr-4">
              <input
                className="text-lg font-semibold text-foreground bg-transparent outline-none w-full placeholder:text-muted-foreground"
                value={card.title}
                onChange={e => updateCard.mutate({ cardId, updates: { title: e.target.value } })}
              />
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityStyles[card.priority ?? 'NONE']}`}>
                  {(card.priority ?? 'none').toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
                <Textarea
                  className="min-h-[100px] text-sm"
                  placeholder="Add a description..."
                  value={card.description_text || ''}
                  onChange={e => updateCard.mutate({ cardId, updates: { description_text: e.target.value } })}
                />
              </div>

              {dependencies.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5" /> Dependencies
                  </h3>
                  <div className="space-y-1.5">
                    {dependencies.map(dep => (
                      <div key={dep.id} className="flex items-center gap-2 p-2 rounded-md bg-muted text-sm">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-card text-muted-foreground">
                          {dep.is_blocking ? 'blocking' : 'blocked by'}
                        </span>
                        <span className="text-foreground">
                          {dep.is_blocking ? dep.blocked_card?.title : dep.blocking_card?.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" /> Comments ({comments.length})
                </h3>
                <div className="space-y-3 mb-3">
                  {comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                        {getInitials(comment.author?.full_name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{comment.author?.full_name || 'Unknown'}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    className="text-sm"
                  />
                  <Button size="sm" variant="outline" disabled={!newComment.trim()}>Send</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Activity</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>Card updated · {card.updated_at ? new Date(card.updated_at).toLocaleDateString() : ''}</p>
                  <p>Card created · {card.created_at ? new Date(card.created_at).toLocaleDateString() : ''}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Priority</h4>
                <div className="flex flex-wrap gap-1.5">
                  {priorityOptions.map(p => (
                    <button
                      key={p}
                      onClick={() => updateCard.mutate({ cardId, updates: { priority: p } })}
                      className={`text-[10px] px-2 py-1 rounded-md capitalize transition-colors ${card.priority === p ? priorityStyles[p] : 'bg-muted text-muted-foreground hover:bg-accent'}`}
                    >
                      {p.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Due date
                </h4>
                <Input
                  type="date"
                  value={card.due_date ? card.due_date.split('T')[0] : ''}
                  onChange={e => updateCard.mutate({ cardId, updates: { due_date: e.target.value || null } })}
                  className="text-xs"
                />
              </div>

              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Story Points</h4>
                <Input
                  type="number"
                  value={card.story_points || ''}
                  onChange={e => updateCard.mutate({ cardId, updates: { story_points: parseInt(e.target.value) || null } })}
                  className="text-xs w-20"
                />
              </div>

              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Paperclip className="w-3 h-3" /> Attachments
                </h4>
                {attachments.length > 0 ? (
                  <div className="space-y-1">
                    {attachments.map(a => (
                      <div key={a.id} className="text-xs text-primary hover:underline cursor-pointer">{a.name}</div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No attachments</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
