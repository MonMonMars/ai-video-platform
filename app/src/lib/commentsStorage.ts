import type { AuthorBadgeFlags } from '../types/catalog'

const COMMENTS_KEY = 'everything-ai.comments.v1'

export interface StoredComment {
  id: string
  titleId: string
  authorName: string
  body: string
  createdAt: string
  likeCount: number
  likedByViewer: boolean
  authorBadges: AuthorBadgeFlags
}

type CommentsByTitle = Record<string, StoredComment[]>

function readAll(): CommentsByTitle {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as CommentsByTitle
  } catch {
    return {}
  }
}

function writeAll(data: CommentsByTitle): void {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(data))
}

const SEED: CommentsByTitle = {
  'neon-orbit': [
    {
      id: 'seed-neon-1',
      titleId: 'neon-orbit',
      authorName: 'OrbitFan',
      body: 'The ringworld chase sequence is pure cinema.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      likeCount: 12,
      likedByViewer: false,
      authorBadges: { isMember: true, isFoundingFan: false },
    },
    {
      id: 'seed-neon-2',
      titleId: 'neon-orbit',
      authorName: 'LaunchCrew',
      body: 'Backed on day one — this episode delivers.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likeCount: 8,
      likedByViewer: false,
      authorBadges: { isMember: true, isFoundingFan: true },
    },
  ],
  'paper-hearts': [
    {
      id: 'seed-hearts-1',
      titleId: 'paper-hearts',
      authorName: 'ArchiveNerd',
      body: 'The misfiled letters plot twist got me.',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      likeCount: 4,
      likedByViewer: false,
      authorBadges: { isMember: false, isFoundingFan: false },
    },
  ],
}

function ensureSeed(titleId: string, list: StoredComment[]): StoredComment[] {
  if (list.length > 0) return list
  const seed = SEED[titleId]
  if (!seed) return list
  writeAll({ ...readAll(), [titleId]: seed })
  return seed
}

export function loadCommentsForTitle(titleId: string): StoredComment[] {
  const all = readAll()
  const list = all[titleId] ?? []
  return ensureSeed(titleId, list)
}

export function addComment(
  titleId: string,
  body: string,
  authorName: string,
  authorBadges: AuthorBadgeFlags,
): StoredComment {
  const trimmed = body.trim()
  if (!trimmed) {
    throw new Error('Comment body is required')
  }
  const comment: StoredComment = {
    id: crypto.randomUUID(),
    titleId,
    authorName,
    body: trimmed,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    likedByViewer: false,
    authorBadges,
  }
  const all = readAll()
  const list = all[titleId] ?? []
  all[titleId] = [comment, ...list]
  writeAll(all)
  return comment
}

export function toggleCommentLike(titleId: string, commentId: string): StoredComment[] {
  const all = readAll()
  const list = all[titleId] ?? []
  const next = list.map((c) => {
    if (c.id !== commentId) return c
    const liked = !c.likedByViewer
    return {
      ...c,
      likedByViewer: liked,
      likeCount: Math.max(0, c.likeCount + (liked ? 1 : -1)),
    }
  })
  all[titleId] = next
  writeAll(all)
  return next
}
