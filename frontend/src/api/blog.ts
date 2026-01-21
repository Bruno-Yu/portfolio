import { request } from '@/api/request'

/**
 *
 * API interface for portfolio data
 * @method queryWorks - Query all works
 * @method querySkills - Query all skills
 * @method querySocialMedia - Query social media links
 * @method querySelfContent - Query self introduction
 */

export function useBlog() {
  return {
    queryWorks: () => {
      return request({
        url: '/api/works',
        method: 'get',
      })
    },
    querySkills: () => {
      return request({
        url: '/api/skills',
        method: 'get',
      })
    },
    querySocialMedia: () => {
      return request({
        url: '/api/social-media',
        method: 'get',
      })
    },
    querySelfContent: () => {
      return request({
        url: '/api/self-content',
        method: 'get',
      })
    },
  }
}
