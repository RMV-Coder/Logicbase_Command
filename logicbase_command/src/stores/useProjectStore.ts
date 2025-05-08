// // stores/useProjectStore.ts
// import { create } from 'zustand'
// import { immer } from 'zustand/middleware/immer'
// import { Project } from '@/app/lib/Interface/interface'
// import * as projectService from '@/app/lib/Services/projects'

// interface ProjectState {
//   projects: Project[]
//   loading: boolean
//   error?: string

//   fetchProjects: () => Promise<void>
//   addProject: (data: Omit<Project, 'project_id'>) => Promise<void>
//   updateProject: (id: number, data: Partial<Project>) => Promise<void>
//   deleteProject: (id: number) => Promise<void>
// }

// export const useProjectStore = create<ProjectState>()(
//   immer((set) => ({
//     projects: [],
//     loading: false,
//     error: undefined,

//     fetchProjects: async () => {
//       set(state => { state.loading = true; state.error = undefined })
//       try {
//         const list = await projectService.getAll()
//         set(state => {
//           state.projects = list
//           state.loading = false
//         })
//       } catch (err: unknown) {
//         set(state => {
//           state.error = err || 'Failed to load'
//           state.loading = false
//         })
//       }
//     },

//     addProject: async (data) => {
//       set(state => { state.loading = true; state.error = undefined })
//       try {
//         const created = await projectService.create(data)
//         set(state => {
//           state.projects.push(created)
//           state.loading = false
//         })
//       } catch (err: unknown) {
//         set(state => {
//           state.error = err || 'Failed to add'
//           state.loading = false
//         })
//       }
//     },

//     updateProject: async (id, data) => {
//       set(state => { state.loading = true; state.error = undefined })
//       try {
//         const updated = await projectService.update(id, data)
//         set(state => {
//           const idx = state.projects.findIndex(p => p.project_id === id)
//           if (idx !== -1) state.projects[idx] = updated
//           state.loading = false
//         })
//       } catch (err: unknown) {
//         set(state => {
//           state.error = err || 'Failed to update'
//           state.loading = false
//         })
//       }
//     },

//     deleteProject: async (id) => {
//       set(state => { state.loading = true; state.error = undefined })
//       try {
//         await projectService.remove(id)
//         set(state => {
//           state.projects = state.projects.filter(p => p.project_id !== id)
//           state.loading = false
//         })
//       } catch (err: unknown) {
//         set(state => {
//           state.error = err || 'Failed to delete'
//           state.loading = false
//         })
//       }
//     },
//   }))
// )
