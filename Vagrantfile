VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  if ENV["TOC_HOST_IP"]
    host_ip = ENV["TOC_HOST_IP"];
    puts "Using #{host_ip} for device livereload."
  else
    host_ip = "127.0.0.1"
    puts "Set $TOC_HOST_IP and reprovision to enable device livereload."
  end

  config.vm.box = "puphpet/ubuntu1404-x64"
  config.vm.provision :shell, path: "toc-setup-env.sh",
    privileged: false, args: host_ip
  config.vm.provision :shell, path: "vagrant-provision.sh",
    privileged: false

  # toc ports
  config.vm.network "forwarded_port", guest: 8100, host: 8100 # http server
  config.vm.network "forwarded_port", guest: 8101, host: 8101 # livereload

  config.vm.synced_folder ".", "/home/vagrant/toc"
  config.vm.synced_folder ".", "/vagrant", disabled: true

  config.vm.provider "virtualbox" do |vm|
    # uncomment if can't mount device from gui
    # vm.gui = true
    vm.memory = 512
    vm.cpus = 1
    vm.customize ["modifyvm", :id, "--usb", "on"]
    vm.customize ["modifyvm", :id, "--usbehci", "on"]
  end

  config.vm.provider "vmware_workstation" do |vm, override|
    vm.vmx["memsize"] = "512"
    vm.vmx["numvcpus"] = "1"
    vm.vmx["vmx.allowNested"] = "TRUE"
    vm.vmx["usb.present"] = "TRUE"
    vm.vmx["ehci.present"] = "TRUE"
  end

  config.vm.provider "hyperv" do |vm, override|
    override.vm.box = "ericmann/trusty64"
    begin
      require_relative "secrets/vagrant-secrets"

      override.vm.synced_folder ".", "/home/vagrant/toc",
        smb_username: SMB_USERNAME, smb_password: SMB_PASSWORD
    rescue LoadError
      override.vm.synced_folder ".", "/home/vagrant/toc"
    end
  end
end
