;; Eval Buffer with `M-x eval-buffer' to register the newly created template.

(dap-register-debug-template
  "Node::Run1"
  (list :type "node"
        :cwd "/home/adriaan/Desktop/wordle-sidekick/"
        :request "launch"
        :program "/home/adriaan/Desktop/wordle-sidekick/cli.js"
        :name "Node::Run1"))
