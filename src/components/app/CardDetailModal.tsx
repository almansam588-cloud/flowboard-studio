import { useStore, Card } from "@/store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Calendar, Tag, Users, Paperclip, Clock, Link2, MessageCircle, Play, Square, ThumbsUp } from "lucide-react";
import { useState } from "react";

const priorityOptions = ['low', 'medium', 'high', 'urgent'] as const;
const priorityStyles: Record<string, string> = {
  urgent: 'bg-destructive text-destructive-foreground',
  high: 'bg-warning text-warning-foreground',
  medium: 'bg-primary text-primary-foreground',
  low: 'bg-muted text-muted-foreground',
};

export function CardDetailModal({ cardId, onClose }: { cardId: string; onClose: () => void }) {
  const { cards, updateCard, getUserById, getLabelById, labels, users, toggleTimeTracking } = useStore();
  const card = cards.find(c => c.id === cardId);
  const [newComment, setNewComment] = useState("");

  if (!card) return null;

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 mr-4">
              <input
                className="text-lg font-semibold text-foreground bg-transparent outline-none w-full placeholder:text-muted-foreground"
                value={card.title}
                onChange={e => updateCard(cardId, { title: e.target.value })}
              />
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityStyles[card.priority]}`}>
                  {card.priority}
                </span>
                {card.labels.map(lid => {
                  const label = getLabelById(lid);
                  return label ? (
                    <span key={lid} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: label.color + '20', color: label.color }}>
                      {label.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left - Main content */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
                <Textarea
                  className="min-h-[100px] text-sm"
                  placeholder="Add a description..."
                  value={card.description}
                  onChange={e => updateCard(cardId, { description: e.target.value })}
                />
              </div>

              {/* Time tracking */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Time Tracking
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{formatTime(card.timeTracked)} logged</span>
                  <Button
                    size="sm"
                    variant={card.isTracking ? "destructive" : "outline"}
                    onClick={() => toggleTimeTracking(cardId)}
                    className="gap-1"
                  >
                    {card.isTracking ? <><Square className="w-3 h-3" /> Stop</> : <><Play className="w-3 h-3" /> Start</>}
                  </Button>
                </div>
              </div>

              {/* Dependencies */}
              {card.dependencies.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5" /> Dependencies
                  </h3>
                  <div className="space-y-1.5">
                    {card.dependencies.map((dep, i) => {
                      const depCard = cards.find(c => c.id === dep.cardId);
                      return (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-muted text-sm">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-card text-muted-foreground capitalize">{dep.type}</span>
                          <span className="text-foreground">{depCard?.title || dep.cardId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" /> Comments ({card.comments.length})
                </h3>
                <div className="space-y-3 mb-3">
                  {card.comments.map(comment => {
                    const user = getUserById(comment.userId);
                    return (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                          {user?.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{user?.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{comment.content}</p>
                          {comment.reactions.length > 0 && (
                            <div className="flex gap-1 mt-1.5">
                              {comment.reactions.map((r, i) => (
                                <span key={i} className="text-xs px-1.5 py-0.5 rounded-full bg-muted cursor-pointer hover:bg-accent">
                                  {r.emoji} {r.userIds.length}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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

              {/* Activity */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Activity</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>Card updated · {new Date(card.updatedAt).toLocaleDateString()}</p>
                  <p>Card created · {new Date(card.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Right - Sidebar */}
            <div className="space-y-4">
              {/* Priority */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Priority</h4>
                <div className="flex flex-wrap gap-1.5">
                  {priorityOptions.map(p => (
                    <button
                      key={p}
                      onClick={() => updateCard(cardId, { priority: p })}
                      className={`text-[10px] px-2 py-1 rounded-md capitalize transition-colors ${card.priority === p ? priorityStyles[p] : 'bg-muted text-muted-foreground hover:bg-accent'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assignees */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Assignees
                </h4>
                <div className="space-y-1.5">
                  {card.assignees.map(uid => {
                    const user = getUserById(uid);
                    return user ? (
                      <div key={uid} className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium text-muted-foreground">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-foreground">{user.name}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Due date */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Due date
                </h4>
                <Input
                  type="date"
                  value={card.dueDate || ''}
                  onChange={e => updateCard(cardId, { dueDate: e.target.value })}
                  className="text-xs"
                />
              </div>

              {/* Story points */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Story Points</h4>
                <Input
                  type="number"
                  value={card.storyPoints || ''}
                  onChange={e => updateCard(cardId, { storyPoints: parseInt(e.target.value) || undefined })}
                  className="text-xs w-20"
                />
              </div>

              {/* Attachments */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Paperclip className="w-3 h-3" /> Attachments
                </h4>
                {card.attachments.length > 0 ? (
                  <div className="space-y-1">
                    {card.attachments.map(a => (
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
