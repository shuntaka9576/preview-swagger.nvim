let g:pswag_root_dir = expand('<sfile>:h:h:h')

function! pswag#util#job_command()
  let node_path = get(g:, 'pswag_node_path', 'node') 
  return [node_path] + [g:pswag_root_dir . '/app/lib/server.js']
endfunction

function! pswag#util#echo_messages(hl, msgs)
  if empty(a:msgs) | return | endif
  execute 'echohl '.a:hl
  if type(a:msgs) ==# 1
    echomsg a:msgs
  else
    for msg in a:msgs
      echom msg
    endfor
  endif
  echohl None
endfunction

function! pswag#util#preview_swag()
  let l:server_status = pswag#rpc#server_status()
  if l:server_status !=# 1
    call pswag#rpc#start_server()
  else
    call pswag#rpc#open_browser()
  endif
endfunction
